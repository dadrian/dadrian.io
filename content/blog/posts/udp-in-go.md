---
title: "UDP in Go"
date: 2020-12-03T20:31:09-05:00
draft: false
uses: ["code"]
---

Go uses the [`net.Conn`][net-conn] interface to abstract different types of
network connections. A `net.Conn` has both `Read` and `Write` methods, and is
usable as an [`io.Reader`][io-reader] and an [`io.Writer`][io-writer]. Some
common implementations of `net.Conn` are [`net.TCPConn`][net-tcp-conn], which
uses TCP to provide reliable streams, and [`tls.Conn`][tls-conn], which wraps
an existing `net.Conn` and uses TLS to provide secure streams. A `net.Conn`
object is usually created with a [`Dialer`][net-dialer] object, or with the
[`net.Dial`][net-dial] function. `Dial` can operate over different transport
protocols (or no transport at all via direct `"ip"` connections!), which is
why it accepts both `"tcp"` and `"udp"` as the network type argument.

When working with TCP, the Go APIs correspond with the system calls you would
use if you were writing the equivalent code in C:
  - `Read` maps to [`recv(2)`][recv2], which, when used with no flags, is the
  same as [`read(2)`][read2], and reads bytes from a socket into a buffer.
  - `Write` maps to [`send(2)`][send2], which, when used with no flags, is
  the same [`write(2)`][write2], and takes a sequence of bytes to send over a
  socket.

For TCP clients, a Go `net.TCPConn` corresponds with a C socket descriptor of type
`SOCK_STREAM` that has already has been passed to [`connect(2)`][connect2],
which establishes a TCP connection via the three-way TCP handshake. In Go,
the `connect` happens when you call `net.Dial("tcp", address)`. For TCP servers,
the Go [`net.Listener`][net-listener] interface provides an
`Accept` function. This corresponds with the [`accept(2)`][accept2] system
call on a socket, which spawns a new connected socket by completing the TCP
handshake with each client that sends a SYN. A **connected** socket is a socket
where the remote address is bound to the socket itself. A connected socket
can only be used with a single remote host. It cannot be used to send network
packets to multiple remote hosts. A **non-connected** socket does not have a
bound remote address. A non-connected socket can be used with multiple
remote hosts. For TCP servers in C, the `accept` function uses a single
non-connected socket, created with [`socket(2)`][socket2], to create many
connected sockets. In Go, a [`net.TCPListener`][net-tcp-listener]
implementing the `net.Listener` interface begets `net.Conn` objects
implemented by `net.TCPConn` via the equivalent `Accept` method. All
connected TCP sockets and `net.Conn` objects implemented by `net.TCPConn` can
be used with `recv`/`Read` and `send`/`Write`, respectively.

This is not the case for UDP sockets. UDP does not have a handshake, and
unlike TCP, a UDP socket used for data transfer is not always connected. In
the UDP protocol, there is no distinction between clients and servers.
Creating a UDP socket or "connection" does not involve sending any packets. A
UDP client is simply the the **initiator**, the party that sends the first
packet, rather than the **responder**, the party that receives the first packet. The initiator necessarily knows the remote address _a priori_, since the intiator has to send the first packet. The responder can learn the remote address when it receives the packet.

The common instantiation of a UDP client in Go is `net.Dial("udp", address)`.
This returns a `net.Conn` object implemented by a
[`net.UDPConn`][net-udp-conn]. It provides both `Read` and `Write` methods.
This is the equivalent of creating a socket of type `SOCK_DGRAM` and calling
`connect` to bind the socket to a specific remote host. The process of
calling `connect` means that the socket is now a connected socket, despite
the fact that UDP is a "connectionless" protocol. Unlike with TCP, calling
`connect` will not cause any packets to be transmitted, since there is no
UDP handshake.

On the server side, UDP looks a bit different from TCP. Since UDP doesn't
require a three-way handshake, there's no need for the `accept` system call.
In Go, this means that there are no UDP listeners. Unlike
[`net.ListenTCP`][net-listen-tcp], which returns a `net.Listener`, the
[`net.ListenUDP`][net-listen-udp] function directly returns a `net.Conn`,
implemented by `net.UDPConn`. This connection will be bound to a source
address, but not a remote address. The `net.UDPConn` is effectively a
non-connected socket ready to receive packets from (or send packets to!) any
host on the network. Unlike TCP, the newly created `net.UDPConn` did not
cause any handshake packets to be sent. In C, to create a non-connected UDP
socket, call `socket` to create a socket of type `SOCK_DGRAM`, and then do
not call `connect`.

A non-connected socket does not have a bound remote end. To handle this,
POSIX introduces two additional system calls:
  - [`recvfrom(2)`][recvfrom2], which takes a buffer to receive data into,
  and a pointer into which it writes out the source address of the
  received data (equivalent to the remote address)
  - [`sendto(2)`][sendto2], which takes a buffer of data to send, a
  remote address to send the data to.

Since the relevant address is a parameter, a non-connected socket used with
`recvfrom` and `sendto` does not need to know the remote end of the
"connection" in advance---it can receive data from and send data to _any_ host
on the network. In Go, in addition to implementing the `net.Conn` interface,
a `UDPConn` implements the [`net.PacketConn`][net-packet-conn] interface
which includes the `ReadFrom` and `WriteTo` methods. These correspond to the
`recvfrom` and `sendto` system calls. A `net.UDPConn` wrapping a
non-connected socket, such as those returned by `net.ListenUDP`, can use
`ReadFrom` and `WriteTo` to talk to arbitrary hosts specified as arguments.

The `read` system call still works on non-connected sockets. Similarly, a
non-connected `net.UDPConn` can still call `Read`. This is equivalent to
calling `recvfrom` or `ReadFrom` with a null source address. The application
data is returned, but the address information is lost. The `send` system call
does not work on non-connected socket; there is no way for the system to
determine who the remote host is. Calling `send` on a non-connected socket
will fail. Similarly, calling `Write` on a non-connected `net.UDPConn` will
fail. In C, a non-connected UDP socket can be made connected via the
`connect` system call. In Golang, there is no way to turn a non-connected
UDPConn into a connected `net.UDPConn` without going through the `syscall`
interface. Therefore, only `WriteTo` can write data through a connection
opened by `net.ListenUDP`.

The behavior of `net.UDPConn` might seem odd, but ultimately it reflects the
behavior of the relevant system calls. At any given time, a `UDPConn` can
only be used with a subset of its available methods, but by tracking what
the underlying system calls would be, you can determine which methods are
safe to use for connection.

Failing that, here's a table:

|   |`ListenTCP`, `DialTCP`|`ListenUDP`|`DialUDP`|
| - | -------------------- | --------- | ------- |
|`Read`|Yes|Drops address information|Yes|
|`Write`|Yes|No|Yes|
|`ReadFrom`|Method Unavailable|Yes|Always returns the dialed address|
|`WriteTo`|Method Unavailable|Yes|No|

[recv2]: https://man7.org/linux/man-pages/man2/recv.2.html
[read2]: https://man7.org/linux/man-pages/man2/read.2.html
[send2]: https://man7.org/linux/man-pages/man2/send.2.html
[write2]: https://man7.org/linux/man-pages/man2/write.2.html
[recvfrom2]: https://man7.org/linux/man-pages/man2/recvfrom.2.html
[sendto2]: https://man7.org/linux/man-pages/man2/sendto.2.html
[connect2]: https://man7.org/linux/man-pages/man2/connect.2.html
[accept2]: https://man7.org/linux/man-pages/man2/accept.2.html
[socket2]: https://man7.org/linux/man-pages/man2/socket.2.html

[net-conn]: https://pkg.go.dev/net#Conn
[net-tcp-conn]: https://pkg.go.dev/net#TCPConn
[net-udp-conn]: https://pkg.go.dev/net#UDPConn
[net-dial]: https://pkg.go.dev/net#Dial
[net-dialer]: https://pkg.go.dev/net#Dialer
[net-listener]: https://pkg.go.dev/net#Listener
[net-listen-tcp]: https://pkg.go.dev/net#ListenTCP
[net-listen-udp]: https://pkg.go.dev/net#ListenUDP
[net-tcp-listener]: https://pkg.go.dev/net#TCPListener
[net-packet-conn]: https://pkg.go.dev/net#PacketConn

[io-reader]: https://pkg.go.dev/io#Reader
[io-writer]: https://pkg.go.dev/io#Writer

[tls-conn]: https://pkg.go.dev/crypto/tls#Conn

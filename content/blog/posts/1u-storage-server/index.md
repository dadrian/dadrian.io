---
title: "Building a 1U storage server"
date: 2026-05-16T17:08:00-05:00
---

A few years ago I decided it would be useful to have a VM and storage server for
the purposes of holding old media files and running a few services locally.
However, I didn't want to have some computer tower sitting around that could
more easily be accidentally turned off. I also didn't want to run some custom
NAS OS, I wanted actual Linux.

In grad school, I administered 2.5 racks of semi-heterogenous hardware in a
pretend data center. Our storage server had a bunch of fans and 4U of space to
fill with spinning disks. Any 1U servers we had were extremely loud. However,
this was before M.2 NVMe drives were commonplace in prosumer hardware.

This gave me an idea---why not do a custom quarter-to-half depth 1U build, using
standard prosumer and enterprise components, throw a few NVMe drives and an
active CPU cooler in it, avoid the incredibly loud 40mm fans, and have a
relatively low power server that could still store 10-30TB?

Reader, it turns out there are a lot of reasons not to do this. But first, let's
continue the story.

When I moved into my current place in 2024, it turned out that the Internet
uplink was already in a small coat closet with a built-in shelf. So I did what
any self-respecting former campus network technician would do, and decided to
use it both as a coat closet and as a network closet. I installed a [2U
under-shelf rack][amazon-rack], designed for quarter-depth[^1] equipment.

The first step was to upgrade my old Ubiquiti equipment, a [first-gen
CloudKey][cloudkey-gen1] and 8-port gigabit PoE switch, with an AC Pro access
point capable of Wi-Fi 5.  The access point, while only Wi-Fi 5, was more than
fast enough for my needs and extremely powerful[^2], so I kept that. I replaced
the switch and CloudKey with a combination [UDM Pro SE][udm-pro-se], entirely
because the UDM Pro can be mounted on a rack[^3].

The modem and AC Pro still sat on the shelf above the rack, but the cabling was
much more minimal, and the shelf was still mostly usable for hats, gloves, and
scarfs. There was 1U of rack space remaining above the hangar bar and coats.
Time for a 1U storage server!

This was not a high priority, because I did not need a storage server in my
life, let alone a 1U storage server.

Then Trump got elected again.

It was clear that Trump was going to put tariffs on everything. So between the
election and inauguration, I just started ordering parts without much of a plan,
assuming prices would be going up in the future. Oh boy was I right about that,
but only partially for the reason I thought. But once again, I digress.

My requirements were "as many NVMe as possible", 10G ethernet, minimum of 128GB
of RAM, and IPMI. I never want to plug a monitor into this computer, and I never
will.

NVMe is actually just PCIEx4. If you want to maximize the number of NVMe drives
on a board, you need to bifurcate a PCIEx16 port into four x4 ports. There are
cards for this that also handle cooling, so [I bought one][asus-nvme].
Otherwise, you'll probably find at most two NVMe ports on a motherboard.

If you apply the 10G ethernet condition, PCIEx16, and IPMI, pretty much the only
option is [a single ASRock Rack motherboard][asrock-mobo]. It might be possible
to swing this with SuperMicro, but I'm morally opposed to them for reasons
related to the absurd amount of time I spent administering them in grad school
and the early days of Censys. They'd also much rather sell you full builds
through a reseller, than individual parts.

Newegg and Amazon had a sale on NVMe drives, so I bought six Samsung 990 Pro 4TB
drives. I bought the lowest power-as-in-watts Intel Xeon CPU that fit an LGA1700
socket, the Intel Xeon E2436. And I bought 128GB of Micron DDR5 RAM. I found a
quarter-depth 1U chassis online that looked like it would fit everything with
millimeters to spare, so I ordered that as well.

Fast-forward a couple months. I finally have the parts on hand.  It turns out,
they do _not_ all fit into the chassis. So I upgrade to a half-depth chassis.
There are not a lot of options for empty 1U chassis of partial depth available
for purchase. Regardless, both chassis together was still less than $100 total.

I start building the server in the new chassis. I also can't seem to find a CPU
cooler that fits. I'm trying to limit the need for the loud 40mm fans, so I
wanted an active cooler that fits in a 1U. After about 4 attempts, I find one
from an off-brand on a site I've never heard of. That is because an active CPU
cooler (with a fan) in a 1U case doesn't make any god damn sense once you put
the lid on---the fan has about 1mm of space, if that, between itself and the
lid.

At this point, there have been multiple follow on orders for thermal paste,
longer ethernet cables to use temporarily while building the machine, extra
screws, a boot hard drive, double-sided tape, tweezers to adjust bent pins, and
Noctua 40mm fans (just in case). It also took me four tries to find a
properly-shaped PCIe extension cable that would let me plug in the Asus M.2 card
into the PCIe slot while still being able to close the lid of the chassis.

I finally get things connected, and discover the motherboard won't even POST.
Eventually, I give up and contact ASRock support. They were very nice, and had
me reseat the CPU a couple times, send them pictures of the pins, and clear the
CMOS. Unfortunately, this step took about a year, entirely because of me, and
not because of William, the very nice support person at ASRock[^4].

I finally start working on the server build again in January 2026. I reopened my
thread with William, confirmed the board was DOA, and RMA'd it.
Despite being obviously out of a return window, ASRock replaced the board for
me!  The replacement posted immediately and booted into UEFI shell, restoring my
confidence in my ability to plug in computer parts and access an IPMI interface.

At this point, I realized I could plug in more drives via the OCuLink port! So I
also added a 2TB boot drive via an OCuLink to SATA adapter. This is just a
normal SSD, and I put it in a holder, and then used double-sided Gorilla tap to
hold it down. I thought about adding more Samsung NVMe drives with the remaining
OCuLink ports, but then I looked at prices. Between when I started the build and
now, not only did tariffs happen (and then get canceled, and then happen again,
and then get canceled, and then happen again...), but inference scaling
happened! RAM and anything solid-state is now very expensive due to massively
increased demand[^5]!

At the time of purchase, the 4TB NVMe drives were ~$250 each. The RAM, four 32GB
sticks of DDR5, was $668 total. Now, the same drives are ~$850 each, and _each
individual RAM stick_ is $2000, meaning I apparently have $8000 worth of RAM in
this 1U build. I could pay for all the money I've wasted on this build just by
reselling the RAM!

And there absolutely has been money wasted! The astute reader might have
realized that the Xeon E-Series CPUs do not support PCIEx16 to x4x4x4x4
bifurcation, only x8x8! This sort of works with the Asus adapter, but I only see
two of the four drives.

I suspect this is fixable by modifying the underlying firmware---the required
hardware is in the chipsets, the functionality has just not been validated to be
an official Intel-exposed configuration. I had Codex spend a while reverse
engineering the firmware[^6] and this is likely addressable in software.
However, I didn't have a good way to test any patched firmware it could create
without risking bricking my hardware. I decided not to patch the firmware, at
least for now, which means I have two NVMe drives that are effectively
paperweights. If anyone has any good ideas for a meaningful test harness for a
reverse engineering coding agent to write this firmware patch, let me know!

\TODO write about nixos

[^1]: Full-depth server racks are ~41". So quarter depth is ~10". This is the
  usual size of a rack-mounted network switch.
[^2]: I bought the max power one in 2017 because the wifi was struggling to
  reach the room I was renting at the time. After replacing my TP-Link with the
  AC Pro, not only did the signal reach my bedroom, but I started getting better
  wifi strength on the driveway than I used to in my bedroom, which was above
  the garage.
[^3]: And man, is it nice to not have to deal with a first-generation Cloud Key.
  That thing is the devil. Who builds a device that receives _power over
  ethernet_, and yet **loses data** if it is not shutdown safely? It is
  absolutely nicer to have the CloudKey + Gateway + Switch in one device. A
  normal person would just buy a Dream Machine and save 50%, but I digress.
[^4]: This is because I backburnered the project while I spent most of the
  second half of 2025 traveling to see a girl.
[^5]: I specifically blame Alex Gaynor for this, iykyk.
[^6]: The lil guy was just going at it with Python, objdump, efidump, and radare.


[amazon-rack]: https://www.amazon.com/dp/B0822MF4R5
[udp-pro-se]: https://store.ui.com/us/en/products/udm-se
[cloudkey-gen1]: https://dl.ubnt.com/guides/UniFi/UniFi_Cloud_Key_UC-CK_QSG.pdf
[asrock-mobo]: https://www.asrockrack.com/general/productdetail.asp?Model=EC266D4ID-2T/X550
[asus-nvme]: https://www.asus.com/us/motherboards-components/motherboards/accessories/hyper-m-2-x16-gen5-card/

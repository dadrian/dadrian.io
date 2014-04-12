{{{
  "title" : "Tracking the Heartbleed Vulnerability",
  "tags"  : [ "openssl", "security", "heartbleed", "zmap", "research" ],
  "category" : "news",
  "date" : "4-11-2014",
  "description" : "Tracking Heartbleed with ZMap",
  "id": 3
}}}

On April 7th, Cloudflare and Google annouced the [Heartbleed](http://heartbleed.com) vulnerability in [OpenSSL](https://www.openssl.org). Within a few hours, my research group had a proof-of-concept exploit detector we created by modifying `openssl s_client`. Shortly after, I wrote a large scale detector in Go that took [ZMap](https://zmap.io) output as input, and output whether or not the hosts found by ZMap were vulnerable.

<!-- more -->

The detector does not actually exploit Heartbleed. Instead, it sends a malformed heartbeat packet with a payload length sent to 0, which results in vulnberable hosts sending us only padding back, rather than private data stored in memory. Non-vulnerable hosts silently discard the packet, as per [the RFC](https://tools.ietf.org/html/rfc6520). Due to the fact it is trivial to modify this detector to exploit vulnerable hosts instead of just detecting vulnerable hosts, we have not chosen to open-source our detector.

We've [posted our results online](https://zmap.io/heartbleed). We found that even two days after the vulnerability was reported, there were still sites in the Alexa Top 500 that were vulnerable to heartbleed. 11% of the sites that supported HTTPS in the Alexa Top 1 Million were vulnerable. The good news is that this number has been steadily decreasing, and by 2:00 PM EDT on April 10th, only 9% of the HTTPS websites in the top one million were vulnerable.

We will post updates as we have them on the [Zmap Heartbleed data site](https://zmap.io/heartbleed). Having been one of the primary maintainers of ZMap for the past few months, I'm excited to make use of it in order to do my part in [fixing the Internet](http://istheinternetfixedyet.com/).
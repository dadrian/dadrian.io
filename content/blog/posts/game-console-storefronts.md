---
title: "Why is there no order queue for game consoles?"
date: 2021-02-04T10:41:00-07:00
---
The preorders for the latest generation of game consoles (PS5, Xbox Series
X/S) were snapped up, and the restocks are flying off the shelves in minutes.
Sony and Microsoft say that they're ramping up production, but to expect
[supply shortages through June of 2021][no-xbox-till-june]. Consoles are
snapped up within seconds after online restocks. Why aren't Sony and
Microsoft making this easier for consumers by introducing an order queue?

<!--more-->

Sony hasn't published PS5 console sales numbers yet, and it's unclear if they
will. Microsoft's head of Xbox, Phil Spencer, says that Microsoft has no
intention of publicly disclosing console sales numbers again, even if they're
outperforming PS5. Microsoft is concentrating on active users, not
consoles sold. This avoids perverse internal incentives, where games are not
ported to PC because it could cannibalize Xbox sales numbers. Microsoft is
also pushing their games-as-a-service platform, Game Pass.

Somewhere between World of Warcraft and League of Legends, game companies
realized that applying SaaS-like continuous revenue models to game releases
can be a lot more lucrative than the classic boxed product games. Why collect
one time revenue when you can collect recurring revenue? Active users will be
more important now than in past generations when comparing the Microsoft and
Sony gaming ecosystems.

Regardless, many gamers want the new consoles, even if games are available on
other platforms. Unfortunately, many people are having trouble getting their
hands on the new consoles. Resale platforms such as eBay and StockX are full
of the new consoles selling for 50% to 100% premiums over MSRP.

Without console sale numbers, it is harder to determine what percentage of
the market is dominated by scalpers. Third-party market research firms such
as NPD have console sale data by aggregating sales numbers directly from
retailers. These firms charge money for access to their data. I'm not a paid
industry analysis, so I don't have access to a subscription. Luckily, [some
of the data is public][npd-data], and we can do some rough estimation to
place some bounds on unit sales.

In the US, the main platforms for scalping are eBay and StockX, followed by
any type of generic marketplace facilitating in-person sales (Facebook
Marketplace, Craigslist, etc). Any bulk scalping activity is not likely to
scale via in-person sales, so I'm going to assume that scalping activity is
dominated by eBay and StockX.

Let's take a look at the PS5. Thanks to [some analysis from Michael
Driscoll](https://dev.to/driscoll42/an-analysis-of-the-80-million-ebay-scalping-market-for-xbox-ps5-amd-and-nvidia-f35)
of eBay, we know that through early December, there were ~33K PS5s sold on
eBay (26K Blu-Ray Edition, and 7K Digital Editions). Over a slightly longer
period (through December 22nd, when I pulled numbers), there have been 51K
PS5 sales on StockX (34K Blu-Ray Edition and 17K Digital Edition). Across
both platforms, a total of 84K PS5 consoles have been scalped. We know from
NPD that [PS5 led the market in spending, but not in units
sold][top-selling-nov]. We know that Nintendo led in units sold, with 1.35M
Switch consoles sold in November. We also know that in total, consumers spent
$1.4B on new gaming hardware, not counting accessories. This means Sony had
at least as much reveneue as Nintendo, who had `1.35M * $250 = 338M`,
assuming roughly equal Switch and Switch Lite sales. Assuming roughly equal
PS5 Digital and Blu-Ray sales, that means Sony had at least `$338M / $450 =
750K` consoles shipped. If you redo the calculation assuming only the
cheapest switches were purchased and the most expensive Playstation, you
still get at least 540K PS5 consoles sold in November.

Now, let's take the sales estimates for eBay and StockX. Only 84K consoles
have sold between the two platforms in November _and_ December. This means
scalping sales on eBay and StockX have accounted for at most 11% to 16% of
sales. Even if these two platforms only have 50% market share of scalping due
to in person secondary sales and sales on other platforms, successful scalps
would still be only 22% to 32% of total PS5 sales. Scalpers might have more
supply that they're unable to sell. As of Dec 22nd, there are only 2.5K PS5
consoles with pending asks on StockX, and 7K available on eBay. Scalpers may
have more beyond that in their inventory, but if buyers aren't buying, they
don't do the scalpers any good and future restock events won't get dominated
by scalpers buying more of a product that isn't reselling. The market could
hypothetically get dominated by hoarding to artificially decrease supply, but
the price premiums on scalped consoles aren't high enough to justify sitting
on units.

It's safe to infer that at least 65% of PS5 sales are going to actual users.
This comes from the most conservative estimates, where we assume:
- 84K consoles have been scalped on eBay and StockX, and another 9.5K will be
  scalped because they are already listed
- StockX and eBay are _only_ half the scaling market
- Sony _only_ sold 540K total consoles in this time.

At the less conservative total sales estimate of 750K sales, that's only 25%
of the market. At a more realistic, yet still conservative estimate of 1.2
million sales in the United States on launch day only, that's 16% of the
market. If eBay and StockX are dominating the market for scalped consoles and
are closer to 100% of all sales of scalped PS5 consoles, then only 8% to 17%
of sales are to scalpers and 83% to 92% of all sales are going directly to
users without being scalped.

Now that we know most sales are going to "real people" and not scalpers,
let's think about running some sort of order system with a queue, similar to
how Apple sells new iPhones. In this model, anybody could purchase a console
at any time. Purchases would be sent out in the order they were received, and
later orders are shipped out later. Orders might take weeks to months to
fulfill. However, users would get the satisfaction of knowing that their
purchase was secure and at MSRP. For this to work, the queue would have to
come directly from Microsoft or Sony, and not from the retailers. Otherwise,
people could sign up in every retailer's queue, defeating the purpose of a
queue. This means that in addition to implementing a queue-based order system
and supply chain, Microsoft and Sony would have to sell consoles directly,
which is not something either has much experience doing.

The margins on a game console for a retailer are roughly only 2-5% of MSRP,
meaning that when Best Buy sells a game console for $500, they make $10 to
$25. If Sony were to introduce a first-party direct-to-consumer storefront,
they could capture up to 5% MSRP currently being given up to retailers. This
extra revenue is independent from the manufacturing costs of the console
itself. We know that Microsoft is selling the Xbox Series X roughly at cost
to retailers. Microsoft will be able to increase their margins on sales by
driving down production costs regardless of whether or not they operate the a
storefront. Running a storefront is just an opportunity to capture the 5%
retail margins. This also means that the cost of running the store need to be
less than 5% of MSRP of each product shipped. Right now, Microsoft and Sony
don't need distribution networks that can reach consumers, they just have to
get game consoles to the right warehouse, and the retailer is in charge of
getting the game console "the last mile" to the consumer. It might not be
feasible for Microsoft to introduce a distribution network capable of
covering the last mile for less than 5% MSRP. Unlike smaller direct to
consumer brands such as reMarkable, Microsoft doesn't need this distribution
to exist---they have an existing distribution via retailers.

On top of this, game consoles have a slow release cycle relative to other
electronics. Unlike the iPhone, which releases a new version once a year like
clockwork, new game consoles are released much more rarely, roughly every 5-8
years. And every time, scalping is an issue. However, when COVID isn't
ravaging the land, if someone _really_ wanted to buy a new console, they
could show up to Best Buy or Target or $RETAILER at 6am after a restock, and
buy a console.

Putting this all together:
  - Somewhere between a majority, and a vast majority of new consoles are
    getting to users without being scalped
  - Running a primary storefront is complicated and expensive, but needs to fit
    within 5% margins on the console.
  - Running a storefront with an order queue is even more complicated.

**tl;dr: I don't expect to see an order queue or a preorder queue from Microsoft or Sony anytime soon. I also wouldn't expect to see it for the next console generation, assuming a pandemic is no longer ravaging the lands.**

[top-selling-nov]: https://www.businesswire.com/news/home/20201210006138/en/Nintendo-Switch-is-the-Top-Selling-Console-in-November-with-More-Than-1.3-Million-Units-Sold
[12-ps5]: https://www.vgchartz.com/article/446429/ps5-sold-an-estimated-21-to-25-million-units-worldwide-on-launch-day/
[npd-data]: https://twitter.com/MatPiscatella/status/1337396190862737414
[no-xbox-till-june]: https://www.theverge.com/2021/2/1/22260564/microsoft-xbox-series-x-stock-june-supply-constraints

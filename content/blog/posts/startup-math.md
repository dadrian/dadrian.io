---
title: "Paper Napkin Math for Evaluating Startup Opportunities"
date: 2022-08-27T05:00:00-0500
draft: false
---

The market is in a “downturn”, and this is percolating into the venture-backed
startup ecosystem. The broad consensus is that the top end of startup valuations
are coming back to reality. But what does this mean? What makes a valuation out
of this world? And how does this affect employees[^1]?

Startup valuations are determined by the amount of money a company raises in
exchange for a percentage of ownership. Usually[^2], this is a 20% stake, meaning
that a company that raises a $15M Series A is usually valued at $15M / 0.2 =
$75M. The Seed round is the first round a company raises[^3], followed by the
Series A, then Series B, and so on. If a company successfully IPOs, it will
usually raise at least through a Series D first[^4].

The general rule of thumb for valuations of startup software companies is that
the valuation _eventually_ (Series C-ish) needs to be around 10x the annual
revenue, with 20x for companies with incredibly strong growth potential. Very
early companies raising seed and pre-seed rounds likely have zero or
next-to-zero revenue, and will usually raise $1-20M be given a valuation in the
$5-100M range based on how good of a team and a story the founders can put
together, and whether or not the [founders are white men][white-male-founders].
Because the startup probably doesn't have any revenue at this point, it's often
simpler to just think of Seed rounds in terms of ownership: you give away 15-20%
of the company in exchange for money, a good story, and maybe some initial
traction. Including the seed round, a company is usually diluted 20-30% by the
Series A, and then another 10-20% for the Series B and each round after that.

Once a startup reaches a point where they’re actually selling a product and
making some revenue, they need to start thinking about how to get to an annual
revenue number that is 10% of their valuation. The better the growth potential
and the better of a storyteller the CEO is, the longer they can put this off. If
the startup has network effects (like a social network), or if user growth is
really strong and bottom-up (like a developer-focused infra startup), and
there's a clear way to _eventually_ convert the users into revenue, this can
further delay the need to align revenue with valuation.

If you are offered options or stock as part of a compensation package at a
startup, the strike price and value of those options are based on the valuation
of the company at the time that you join. Some people who took jobs with
startups that offered stock worth a lot of money “on-paper” are realizing that
the company is [not able to reach the amount of growth required][bolt-oops] to
sustain its valuation. These companies will have to raise a down round or
drastically cut costs in order to have enough runway to stay alive long enough
to get revenue to a sustainable level, unless they can somehow find a greater
fool to sell to at an even higher valuation. This may result in the stock
becoming worth a lot less than it initially appeared.

The loftier the goals of the startup and the better the economy, the longer an
unrealistic disconnect between valuation and revenue can be maintained. Founders
will raise at high valuations because they likely can take some money off the
table during the high valuation rounds, and it dilutes less. It makes a company
appear as though it is successful, and draws attention of customers and future
investors. They may have aspirations for the company that match a higher
valuation. And venture capitalists generally would rather see you try to get to
$10B exit and fail, than “sell out” for less than $1B.

With a large enough reality distortion field, [some startups][nyse-net] might
even manage to IPO at multiples considerably above 10x revenue. This can be
especially good for early investors and employees, since after the lock-out
period, they can all dump their shares on the retail stock market. This is
fairly rare, and likely still requires $100M-$1B in annual revenue. Even in
cases with sane multiples, it’s not necessarily wrong to think of venture
capital as a dump on retail---someone is paying out the valuation back to the
investors.

Given some public information about raises, and ideally, a share price or strike
price, you should be able to figure out valuations and how much you would make
on potential exits[^6]. You can plug in the values you know, either from press
releases or an offer letter, and backcalculate how much your offer is worth, and
if the company is at a sustainable valuation. If the company is not at a
sustainable valuation, try to figure out if there’s a path for the sales numbers
to make sense, or if the CEO is capable of maintaining reality distortion field.
If not, know that the money is going to dry up. This might be OK, depending on
your career, and your cash salary, and your value to the company, or it might
make your offer much worse than it appears on paper.

However, know that deals and even IPOs can get arbitrarily complicated.
Sometimes a company will also have [penny warrants][penny-warrant], or investors
with [liquidation preferences][liq-prefs], or "regular" debt that needs to be
paid back. Investors have preferred stock, whereas employees and founders will
usually have common stock. Preferred stock often has more rights and at least a
1.0 liquidation preference. In an acquisition, if the purchase price is below
the last valuation, preferred shareholders will still get paid out as if the
price was the previous valuation, which will squeeze common stock
shareholders[^5].  It's usually a safe bet to assume that even if you know your
exact ownership percentage and the exact purchase price, that you'll end up with
less than that once all the dust settles. Even worse, depending on the
acquistion details, the common stock holders might not get anything at all.

**Rules of Thumb**:
* Dilution is usually at 20-30% after the Series A, and 10-20% for later rounds (Series B+)
* Valuation is capital raised divided by the dilution
* Strike price is a 60-70% discount on the share price as determined by the latest [409A valuation][409a], assuming there’s not an active secondary market for the stock
* The share price is the valuation divided by the number of shares
* Your ownership is the number of shares in your grant divided by the total number of shares
* Each round, new preferred shares are issued to the investors participating in the round, in proportion to the dilution
* Investors that don't pro-rata up (put in more money to maintain ownership), will also get diluted on future rounds
* At acquisition, money is (usually) paid out in proportion to percentage ownership, with the preferred shareholders getting paid out first
* Once you have stock, you will be diluted on future rounds
* Your ownership percentage will decrease by the dilution, but ideally the total value of your ownership will increase because the valuation is also increasing.
* Your new ownership percentage is the old percentage scaled by 1 minus the dilution.
* Your new ownership “value” is the new percentage multiplied by the new valuation.

This might seem complicated, but it's nothing harder than a high school algebra
homework problem.

_Thank you to Andrew Sardone, Martin Casado, and Chase Roberts for reading an earlier draft of this post_

[white-male-founders]: https://www.techstars.com/the-line/pov/why-do-white-men-raise-more-vc-dollars-than-anyone-else
[bolt-oops]: https://www.nytimes.com/2022/05/10/business/bolt-start-up-ryan-breslow-investors.html
[nyse-net]: https://www.google.com/finance/quote/NET:NYSE
[liq-prefs]: https://www.investopedia.com/terms/l/liquidation-preference.asp
[penny-warrant]: https://www.cooleygo.com/what-you-should-know-about-warrants/
[409a]: https://carta.com/blog/what-is-a-409a-valuation
[holman-options]: https://zachholman.com/posts/fuck-your-90-day-exercise-window/
[wong-options]: https://jamie-wong.com/post/valley-equity/
[dan-options]: https://medium.com/@DanEyman/8-questions-to-ask-about-startup-equity-before-accepting-the-job-a9c8954b6ad7

[^1]: This is meant to be a rough explanation for employees, or anyone who is not a founder and not an investor. Don't read this, then immediately start trying to price deals on AngelList. This is also _not_ investment advice.
[^2]: This is heavily caveated. Everything can change deal to deal, but the current conventional wisdown is 20-30% dilution for Series A, including Seed, and 10-20% for each round after that.
[^3]: There might also be a _pre-seed_ or _angel_ round, which is when a company loosely raises some money, usually from individual angel investors.
[^4]: Snowflake IPO'd after raising a Series G.
[^5]: In this scenario, no one is actually happy. No one wants this, not even the preferred shareholders. Again, details will vary depending on the terms.
[^6]: There is a whole separate discussion to be had about how options work and the tax implications of vesting and exercising. I'm not trying to cover that here, this post is helping answer the question "Is it _possible_ for this startup to have a successful exit?". For more details on equity and strike prices, see these posts by [Zach Holman][holman-options], [Jamie Wong][wong-options], and [Dan Eyman][dan-options].

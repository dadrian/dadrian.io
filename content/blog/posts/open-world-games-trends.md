---
title: "Is open-world design making games worse, or am I just getting old?"
date: 2025-03-15T14:25:08-05:00
js: games-bundle.js
---

Around the time that Elden Ring came out (an actually good open-world game), I
had the thought that it seemed like AAA games were getting worse, especially
post-pandemic. It also seemed like there were more and more open-world games and
more games in large franchises (rather than new IP). My hypothesis was that
open-world was increasing because it's easier to scale-up an open-world game to
match the expectations on today's games---give each designer a separate region,
cut dependencies between various levels and teams.

It's easier to pitch "We'll build this giant world, it'll be dope" than it
is to say "Trust us, we're gonna design 10 incredible levels". However, just
because something is open-world and big, doesn't mean that it will be fun. The
risk with open-world is that you exchange scale for cohesion and quality. The
main driver for progressing in a game stops being winning or going on a journey
with the characters, and becomes completing a map and making stats go up. The
games become less fun and more repetitive.

It's also less risky to pitch a game in an existing, successful franchise, than
it is to make something new. So as [costs of AAA games are going up][aaa-cost][^5],
I expected there to be more franchise games.

The idea that there were more open-world games and more franchise games, and
that these games were getting worse, seemed aligned with my lived experience. I
could go on and list some examples of games. But, most of this hypothesizing is
just me [making stuff up!][david-tweet-thread]. Instead, let's look at the data
and determine if the premises for this hypothesis are even true, or if it's
based on faulty assumptions. Let's be specific, so here's the hypothesis:

> AAA games are getting worse, because as they scale up for new console
> generations, more and more AAA games are open-world or in existing franchises,
> and both of these trends tend to result in worse games.

Ignoring whether or not open-world games and franchise games are worse than other
games, this hypothesis is based on a premise that is testable with some basic
data analysis---**are there more open-world and more large franchise AAA games
now, than there were in the 2000s?**

No attention span? Jump to the [summary](#tldr).

## Analysis[^1]

### Games

The [Internet Game Database][igdb] (IGDB) has a dataset consisting of just about
every game and its release date(s), platforms, publisher, developer, and
[MetaCritic][metacritic] score. The population for the data analysis will be
_any game released on a [Generation V][gen5] or newer non-smartphone,
non-portable console platform in IGDB.

{{% rawhtml %}}
<div id="aaa-platforms"></div>
{{% /rawhtml %}}

Given that, we can filter the IGDB game list to include only titles released on
those platforms since Sony launched the PS1 in 1994. That filter yields
**124,917 games**. I'm not going to include them here, but if you're interested,
check out the [underlying Colab][igdb-colab].

### AAA vs. Indie

To understand if AAA games are more open-world or more often part of a franchise
than in the past, we need to label which games count as AAA. We'll use the
"indie" tag from IGDB to identify indie games[^2]. This identified **62,561
indie games** in our game population.

Identifying AAA games is harder. I actually started this analysis in early 2023,
and didn't finish because I didn't have a good way to label AAA or not. Most
non-indie games should not be counted as a AAA---there's a long tail of just
normal "games" put out by reasonably sized well-funded publishers, but that
don't necessarily reach the level of what would be considered full AAA. The best
way to identity AAA would be to somehow join to a dataset of development cost
and marketing spend, and take, say, the top decile. However, that data is much
harder to come by if you're just an armchair analyst, like me.

It turns out that Gemini 2.0 Flash is actually quite good at labeling whether or
not a game is AAA, given the game entry from IGDB (and it's quite easy to call
from Colab!). It works best if you ask it one game at a time whether or not it's
AAA. This is a little slow, since you have to make one API call per row.
However, it still only costs around 30 cents to annotate every game.
Spot-checking the results seemed reasonable, so let's use Gemini as our AAA
labeler.

Gemini labeled **3,396 AAA games** in our game population.

Let's take a look at our labeling by graphing game counts per year, for the
whole population, indie, and AA games[^4]. Keep in mind this graph uses a log
scale.

{{% rawhtml %}}
<div id="game-categorization-by-year"></div>
{{% /rawhtml %}}

First, there's clearly an explosion in indie games, starting in the mid-2000s.

Second, we can see a jump in game counts across the board between 1994 and 1995.
This is because the Generation V consoles were released halfway through the
year. but since we don't slice out by generation _after_ GenV, we don't ever see
it drop back down once the later generations come out.

If we look at just the AAA game counts on a linear scale below, we can see it
increasing roughly linearly over time, although the beginning of the curve is
artifically deflated due to the generation restriction.

{{% rawhtml %}}
<div id="aaa-by-year"></div>
{{% /rawhtml %}}

### Open-World

IGDB labels games with an "open-world" tag in the "theme" category. This is
straightforward to extract from our base game population. There are **2,166
open-world games** included in our game population. Let's look at the absolute
numbers for both indie and AAA open-world games over time.

{{% rawhtml %}}
<div id="open-world-absolute-by-year"></div>
{{% /rawhtml %}}

There's certainly a "post-Skyrim bump" in open-world games starting around 2012,
with AAA decreasing from the post-Skyrim peak in the late 2010s.  There is a
drastic increase in _indie_ open-world games. We already know there's been an
explosion in indie games overall, so how does this look if we normalize the
counts as a fraction of total indie and AAA games?

{{% rawhtml %}}
<div id="open-world-fraction-by-year"></div>
{{% /rawhtml %}}

The fraction of indie games bounce around a lot in the early days, when the
absolute number of games was very low. But once the "indie renaissance" starts
in the 2000s, it's pretty clear that as a portion of the population, almost no
indie games are open-world.

AAA games, on the other hand, still follow the same trend as the absolute
numbers---a post-Skyrim increase, followed by a back-off starting in the late
2010s and continuing throughout the 2020s.

So, the answer to the first part of the hypothesis---are there more AAA
open-world games than there used to be---is definitely no. There are **less AAA
open-world games in the 2020s than in the mid-2010s, on both a relative and absolute
basis**.

### Franchise Games

A few sequels can be fine[^3], but sometimes franchises like Assassin's Creed,
Call of Duty, and FIFA, seem to go on _forever_. This isn't necessarily bad
thing, but is it more common recently? To understand this, let's pick an
arbitrary threshold of four or more games per franchise, and label them as
"late-stage franchise games". Again, IGDB has a concept of franchises, and any
game can be in zero, one, or more franchises. We'll count any game that is at
least number 4 in _all_ its franchises as a late-stage franchise game.

Across 955 franchises with at least 4 games, there were **5,483 "late-stage"
franchise games** released within our game population.

Looking at the data over time, we see a clear trend of an increase
year-over-year in the absolute count of AAA late stage franchise games, _but it ends in the late
2010s!_. Again, similar to open-world, we see it decrease in the 2020s.

{{% rawhtml %}}
<div id="franchise-absolute-by-year"></div>
{{% /rawhtml %}}

Normalizing it as a fraction of AAA games total, we see a continued decrease
since the launch of Generation 5. Nearly all AAA games used to be part of a
large franchise (e.g. Mario). Now, there's far more non-franchise or early
franchise AAA games than there were in the 90s.

{{% rawhtml %}}
<div id="franchise-fraction-by-year"></div>
{{% /rawhtml %}}

This suggests that the second half of the hypothesis is also false---games
cannot be getting worse because there are more franchise games, because **there
are less late-stage franchise games in the 2020s than there were in the 2010s or
2000s**.

## Ratings

IGDB has Metacritic scores, so we can look at those. Since Metacritic is an
aggregator, we can expect some sort of smoothing of the underlying curve to a
target distribution to account for rating inflation, which might hide some
trends. However, assuming uniform modification by Metacritic, we can still look
at the relative ratings of open-world and late-stage franchise AAA games,
compared to AAA and indie games generally. Below if the median (P50) ranking for
various game types.

{{% rawhtml %}}
<div id="ratings-by-year"></div>
{{% /rawhtml %}}

We can see above, that for the most part, open-world AAA games have a higher
median rating than AAA games do generally. Late-stage franchise games do as
well, but the effect is less prounced. Interestingly, there are two small dips
in the ratings of open-world games---during the post-Skyrim boom, and a clear
downard trend in the 2020s. So maybe open-world AAA games are worse than they
used to be, but they don't seem to be worse than AAA games generally. We'll see
if the trend continues into the rest of the 2020s.

## Summary {#tldr}

For AAA games, neither open-world games, nor late-stage franchise games are more
common now, than they were in the 2000s. Open-world AAA games peaked in the late
2010s, and have been decreasing. Late-stage franchise AAA games have been
decreasing over time. It _may_ be the case that open-world AAA games in the
2020s are worse than they were in the late 2000s, but they're actually not worse
than they were in the mid-2010s post-Skyrim.

This means I'm mostly wrong---games can't be getting worse because they're more
open-world or more franchise-y, because they're actually _less_ of both.

Instead, I think I'm just old.


[david-tweet-thread]: https://x.com/davidcadrian/status/1631767778347876352
[aaa-cost]: https://www.matthewball.co/all/stateofvideogaming2025
[igdb]: https://www.igdb.com/
[metacritic]: https://www.metacritic.com/
[gen5]: https://en.wikipedia.org/wiki/Fifth_generation_of_video_game_consoles
[ethos]: https://www.imdb.com/title/tt0118715/quotes/?item=qt0464759
[igdb-colab]: https://colab.research.google.com/drive/1frptKLlDTRKvdQ4tggNzXyntTwjYiq6p#scrollTo=0W1HDHVR6XTu

[^1]: If you'd rather stare at a Python notebook without my colorful prose, the
  raw analysis for this post is available [here][igdb-colab].
[^2]: This has the same caveats as any crowdsourced data, but like, [at least
  it's an ethos][ethos].
[^3]: _Halo 3_ has entered the chat.
[^4]: Remember, since a game can be neither AAA nor indie, these two lines will
  not sum to the total line.
[^5]: Slides 109-127

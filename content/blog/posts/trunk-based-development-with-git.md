---
title: "Trunk-Based Development with Git"
date: 2021-06-01T11:56:00-07:00
draft: false
---

_This introduces people familiar with Git to [trunk-based
development][trunk-dev], and vice-versa. I wrote it for work in reference to
Github, but it applies to any Git web UI that supports pull requests. I've been
told it's a useful reference, so I'm posting a lightly-edited version publicly._

> **tl;dr:** One [idea is one commit][one-commit]. Implement [trunk-based
development][trunk-dev] using the standard Github branch and PR-based
development process, defaulting to squash commits.  Rebase onto `main` to
resolve merge conflicts.

## Branch PR Workflow

Github documents a common workflow in [this guide][gh-guide]. We adapt
the approach slightly:
* Please prefix your branches with your username, e.g.
  `dadrian/pin-forks-go-mod`, or `ross/require-gdate`.
* Unless you are a Git Pro (TM) and have specifically cleaned your branch's
  history for clarity, merge using a [squash commit][squash-commits]. This
  should be set as the default merge strategy.
* Repositories should be set up to delete branches after merging, so
  that we don't pollute the global namespace
* If you are opening a PR before it is ready for review, prefix the PR name in
  Github with `WIP:` (Work-in-progress).
* You are responsible for getting your own PRs merged. If review is blocked, it
  is on you to hunt down reviewers. If your PR has been approved but not yet
  merged, it is on you to actually click the merge button.

## Code Review

_This depends significantly on your organizations engineering culture, and will
likely need to be tweaked. For example, ZeroMQ uses [optimistic
merging][zmq-merge]._

## Review

Branches should be reviewed before merging. Nametag does not yet have a concept
of code owners, so use your own discretion when selecting a reviewer. Unless
explicitly noted in the PR description, approval from a single reviewer is
sufficient to merge. Approval is indicated using the "approve" button on Github.

### LGTM % Approvals

Sometimes minor changes are suggested, but implementing these changes shouldn't
require another round of reviews. We use "sticky" approvals, which means that
the approval stays even if the code changes. If you have minor comments about
style, spelling, etc. that don't need further review, leave the comments and
approve the PR, except note in the acceptance message that everything looks good
aside from your comments, e.g. by writing `LGTM % comments` (Looks good to me
mod comments). This indicates to the developer you expect that to make the minor
changes before merging.

### Straight-To-Main (STM) Commits

Sometimes, it's not worth the time to get a review. You shouldn't do this all
the time, but trivial fixes can be pushed straight-to-main (STM). Please use
the prefix `STM: ` in your commit message. If this breaks something, it is on
you to fix it. With great power comes great responsibility.

## FAQ

### Why Squash Commits?

Squash merges condense all commits on a branch into a single-commit, and then
"applies" that commit to the target branch being merged into. This causes a PR
to look like a single commit after merge. As a result, there is no "merge
commit" with two parents in the Git history.

In general, we want all commits to be reversible if they break anything, whether
it's post-merge CI, staging, or production. One commit = one idea.
Realisitically, not all commits are revertable for correctness reasons (e.g. a
commit that does a destructive data migration). However, using a squash-merge
technique means that ops can revert any change by only specifying a single
commit hash. The lack of multi-parent merge commits keeps the `main` branch
history linear, which is easier to trace historically, both in the Github UI and
using tools such as `git-bisect`. This strategy _in general_ aligns well with
[trunk-based development][trunk-dev].

The main downside to squash merging is the same as rebasing: the commit
hashes change on merge. The lack of merge commits also means that your local
Git client "can't tell" that the branch has been merged, so you may receive
additional warnings when attempting to delete the branch locally.

Like any guidelines, there are exceptions to this. Merge commits may be useful when:
* a branch is long-lived with a clean history
* an external repository is being imported into an existing repository

Remember, long-lived branches should be avoided. For large refactors and
long-term work, prefer to [branch by abstraction][branch-abstraction].


### Just give me some commands!

**Change branches**

Checkout an existing branch:

```
git checkout dadrian/my-existing-branch
```


**New branches**

Create a new branch relative to the current branch:

```
git branch dadrain/my-new-branch
```

Create a new branch relative to another branch:

```
git branch dadrian/rabbit-hole dadrian/my-existing-branch
```

Create a new branch relative to the current branch, and switch to it:

```
git checkout -b dadrian/my-new-branch
```

Create a new branch relative to specific branch, and switch to it:

```
git checkout -b dadrian/my-new-branch dadrian/my-existing-branch
```

**Pushing branches**

Push a branch:

```
git push origin dadrian/my-existing-branch
```

Push a new branch for the first time:
```
git push -u origin dadrian/my-existing-branch
# The -u prevents you from having to run git branch --set-upstream-to later
```

**Switch branch to be based on latest main**

Rebase a branch onto latest main (useful to resolve merge conflicts)

```
git checkout main
git pull --rebase
git checkout dadrian/out-of-date-branch
git rebase main
git push --force-with-lease origin dadrian/out-of-date-branch
```

**Squash merge causes conflicts for dependent branch**

Did you branch off main to create `pr-one`, then branch off `pr-one` to create
`pr-two`, then squash merge `pr-one` and now you have a bunch of conflicts?
Usually the easiest fix is to rebase `pr-two` onto main and "drop" each commit
that got squashed by merging `pr-one`

```
git checkout main
git pull --rebase
git checkout pr-two
git rebase -i main
# mark each commit merged as part of pr-one as "drop"
git push --force-with-lease origin pr-two
```

[trunk-dev]: https://trunkbaseddevelopment.com/
[gh-guide]: https://guides.github.com/introduction/flow/
[squash-commits]: https://docs.github.com/en/free-pro-team@latest/github/administering-a-repository/about-merge-methods-on-github#squashing-your-merge-commits
[branch-abstraction]: https://trunkbaseddevelopment.com/branch-by-abstraction/
[zmq-merge]: http://hintjens.com/blog:106
[one-commit]: https://secure.phabricator.com/book/phabflavor/article/recommendations_on_revision_control/

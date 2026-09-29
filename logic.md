# Investment & profit (user)

- **Active investment** = sum of admin-approved payment amounts (18-month plans).
- **Daily profit** = **0.5%** of each active plan’s principal on **Mon–Fri**.
- **Sat & Sun** = **$0** profit that day (America/Toronto calendar).
- **Today’s profit** = today’s 0.5% total across active plans (or $0 on weekends).
- **Total profit** = all weekday profits from approval through today (or plan end), for **active** plans only.
- Example: **$100** → **$0.50**/weekday; ~7 days with a weekend → about **$2.50** total; ~18 months → about **$200** profit.
- **Withdrawal of profit** is on the **1st day of every month** (shown on My Account).

These daily / total profits are **separate** from team / referral bonuses below.

---

# Team / referral (user)

## Tree (how the team is built)

- Every user has a unique **`referral_code`** and optional **`referred_by`** (parent profile id).
- Signup with someone’s code sets `referred_by` → that person is the **direct** referrer.
- The team is a **tree**: walk `referred_by` links to build parents / children.
- Team tab shows this tree so a user can see who is under them (direct and deeper).

## Commission rates (one-time only)

Referral / team bonus is **not** daily. It is a **one-time** commission **per approved payment** (based on that approved payment amount). Re-approving the same payment does not double-pay (ledger unique on payment + beneficiary).

- **Referral bonus is instant and will be processed in 24 hrs** (shown on Team tab).

| Relationship to the investor | Commission |
|------------------------------|------------|
| **Direct** (you are their `referred_by`) | **5%** of that investment |
| **Indirect** (deeper in the chain under you) | **1%** of that investment |

Same investment can pay **both**: e.g. B referred D; A referred B. When D invests: **B gets 5%**, **A gets 1%**.

## Depth / levels (from the root user looking down)

Count **level** from the person earning commission:

- **Level 1** = direct referrals (5%).
- **Level 2+** = indirect (1% each), walking the tree down.

### Default unlock (fewer than 5 directs)

- With **fewer than 5** direct referrals, you earn:
  - **5%** on level 1 (directs), and
  - **1%** indirect only through **level 5** (not deeper).
- Copy on Team: “Create 5 direct referrals and unlock the next level.”

### Extended unlock (5+ directs → up to level 10)

- If A has **at least 5 direct referrals**, A’s **indirect** range extends from level 5 up to **level 10** (max).
- Still: level 1 = **5%**, levels 2–10 = **1%** each (one-time per approved investment).

## Team ranks (gamification)

Automatic rank from **combined** direct + indirect team size (no admin-granted badges):

| Rank | Team size |
|------|-----------|
| Bronze | 0–4 |
| Silver | 5–14 |
| Gold | 15–49 |
| Platinum | 50–99 |
| Diamond | 100–249 |
| Black Diamond | 250–499 |
| Director | 500+ |

Shown on My Account with progress toward the next rank.

## Driven by DB

- Tree + eligibility come from `profiles.referral_code` / `profiles.referred_by`.
- Commission amounts come from approved `payment_submissions` under those downline users.
- Team UI = tree from that graph; bonus totals = sum of `referral_commissions` for the logged-in user.
- Implemented: migration `007_referral_commissions.sql` (ledger + approve trigger + team RPC depth 10).

---

# Admin Overview

- **Active investment** = sum of all **approved (active)** payment amounts.
- **Pending review** = **number** of pending approval submissions.
- **Declined** = **number** of declined submissions.
- **All users — today's profit** = sum of every investor's weekday profit today.
- **All users — total profit** = sum of all-time accrued profit across investors.
- Users table also shows each member's **daily profit** and **total profit**.
- Approvals, Support, Audit logs, and Commissions read live from the database.

# Admin Commissions

- Table of investors with **referral commission** totals (from `referral_commissions`).
- Platform **total referral commissions** = sum of all commission rows.
- No admin-granted reward badges (ranks are automatic from team size).

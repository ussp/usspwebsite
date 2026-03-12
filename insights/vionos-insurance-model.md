# VionOS.ai — Model B: Insurance Company as Customer

**Date:** March 2026
**Model:** Partner with FEC insurance carriers. They pay, they distribute, parks get cheaper insurance.

---

## How It Works

1. VionOS.ai partners with an FEC insurance carrier
2. Carrier offers policyholders a premium discount for installing VionOS.ai
3. VionOS.ai gets paid per facility — by insurer directly or bundled into premium
4. Insurer's claims cost drops. Park's premium drops. VionOS.ai gets recurring revenue.

---

## Unit Economics Per Facility

| Item | Without VionOS.ai | With VionOS.ai |
|---|---|---|
| Annual insurance premium | $250,000 | $200,000 (20% discount) |
| Park saves | — | $50,000/year |
| VionOS.ai cost (paid by insurer or shared) | — | $12,000-$18,000/year |
| Insurer's net savings (reduced claims) | — | $20,000-$50,000/year |

Real insurer savings come from fewer claims, not the premium discount. Average park: 2-3 injury claims/year at $10K-$50K each. If VionOS.ai reduces that by 30-50%, insurer saves far more than what they pay for VionOS.ai.

---

## Payment Structure Options

**Option 1: Insurer pays directly**
- $500-$1,500/month per facility
- Simplest for the park — they just get cheaper insurance
- Insurer recoups through reduced claims

**Option 2: Shared cost**
- Insurer pays 50%, park pays 50%
- Park pays $500-$750/month, still saves net (premium discount > their cost)

**Option 3: Bundled into premium (strongest long-term)**
- VionOS.ai cost embedded in the insurance premium
- Park pays slightly higher than discounted rate, still lower than without VionOS.ai
- Park doesn't see VionOS.ai as a separate line item — zero sales friction
- VionOS.ai gets paid per policy by the insurer

---

## Revenue Projections (at $1,000/month per facility from insurer)

| Milestone | Facilities | Monthly Revenue | Annual Revenue |
|---|---|---|---|
| Pilot (Launch only) | 1 | $0 (proving stage) | $0 |
| First insurance partner, initial rollout | 20-50 | $20K-$50K | $240K-$600K |
| Partner mandates for new policies | 100-200 | $100K-$200K | $1.2M-$2.4M |
| Second insurance partner | 300-500 | $300K-$500K | $3.6M-$6M |
| Industry standard (3+ carriers) | 1,000+ | $1M+ | $12M+ |

**You don't sell to 1,000 parks. You sell to 3-5 insurance companies. They push it to their policyholders.**

---

## FEC Insurance Market (Concentrated — Few Players)

- **K&K Insurance** — largest FEC/amusement insurer in the US
- **XINSURANCE** — specializes in hard-to-insure recreation
- **McGowan Allied** — amusement and leisure specialty
- **Granite Insurance** — recreation and entertainment
- Small number of specialty carriers — one partnership = access to hundreds/thousands of parks

---

## What the Insurance Company Needs Before Partnering

| Requirement | How to get it |
|---|---|
| Accurate violation detection | Launch deployment — 60-90 days shadow mode data |
| Proof it reduces incidents | Launch before vs. after incident comparison |
| Actuarial modeling | Work with insurer's actuarial team on claims reduction model |
| No additional liability for insurer | Legal review — supplements staff, doesn't replace. Clear disclaimers. |
| Easy deployment for policyholders | Standardized: Jetson + existing cameras, 1-2 week setup |
| Compliance documentation | Automated audit logs, shift reports, violation tracking |

**Launch deployment is the actuarial pilot.** Need before/after data from a real facility.

---

## Sales Cycle

| Step | Timeline |
|---|---|
| Launch deployment + data collection | Month 1-7 |
| Package actuarial case study | Month 7-8 |
| Approach FEC insurance carriers | Month 8-9 |
| Pilot with one carrier (10-20 parks) | Month 10-16 |
| Full rollout if pilot succeeds | Month 16-24 |

**~2 years to meaningful insurance-channel revenue.** Realistic, not aggressive.

**Selling to a park:** weeks/months per deal, price sensitive, high churn
**Selling to an insurer:** 6-12+ months to close, but one deal = hundreds of facilities

---

## Realistic Pricing for Parks (if selling direct, not through insurer)

$3,000-$5,000/month is too high for most parks.

| Park metric | Typical range |
|---|---|
| Annual revenue | $1M - $4M |
| Net margins | 10-20% |
| Monthly profit | $8K - $65K |
| Insurance premium | $8K - $42K/month |

**Realistic direct price: $500-$2,000/month.** ROI must be obvious — insurance savings > VionOS.ai cost.

---

## Defensibility / Moat

- Insurance company won't switch easily once claims data proves the model (retraining, redeployment, new actuarial baselines)
- Training data and violation models improve with every facility (network effect)
- Domain-specific violation taxonomy is proprietary
- First mover in FEC AI safety monitoring
- High switching cost for the insurer = long-term contracts

---

## Risks

- **Insurance companies move slowly.** 6-12 months is optimistic. Could be 18+.
- **Actuarial proof needs volume.** One facility for 3 months may not be enough. They may want 5-10 facilities for 12+ months.
- **Liability if system misses an injury.** If VionOS.ai is installed and fails to detect, does insurer have increased exposure? Legal must be airtight — position as supplemental, never replacement.
- **Large carrier could build in-house.** Defense: speed, domain expertise, being embedded first.
- **Park adoption friction.** Even with insurer discount, parks may resist installing hardware/cameras. Needs to be turnkey.

---

## Valuation at Different Stages (Model B)

| Stage | What you have | Valuation |
|---|---|---|
| Today | Idea + owned facility | $0 - $500K |
| Launch deployed with data | Working product, accuracy metrics | $1M - $2M |
| 5-10 parks paying directly | $90K-$180K ARR | $2M - $5M |
| Insurance company partnership signed | Distribution channel locked | $5M - $15M |
| 100+ parks via insurance channel | $1.2M+ ARR | $15M - $30M |
| Industry standard (3+ carriers) | $5M+ ARR | $50M+ |

**The insurance partnership is the inflection point, not the number of individual parks.**

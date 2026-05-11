# Eggplant AI — Research Brief

**Audience:** DCFS / ILC pilot team (Krasan-led AI transformation)
**Date:** 2026-05-08
**Purpose:** Validate the working hypothesis that "Eggplant's vendor AI roadmap is the right path" for tester productivity, *not* this pilot's currently-approved tools (Copilot + Rovo + Zephyr Scale Agent).

---

## What Eggplant AI is

"Eggplant AI" is **not a single SKU today** — it is an umbrella term for AI/ML capabilities distributed across Keysight's Eggplant product family: **Eggplant DAI** (Digital Automation Intelligence — the model-based testing engine and orchestrator), **Eggplant Functional / EPF** (the SenseTalk-driven UI execution engine using image+text recognition), **Eggplant Performance**, and as of 2025 the new standalone **Keysight Generator** (on-prem GenAI for requirements-to-tests). The legacy product literally called *"Eggplant AI"* (predecessor to DAI) has not had public release notes since v3.1 (Oct 2019); its functionality was absorbed into DAI. So when DCFS staff say "Eggplant AI," they almost certainly mean **DAI + Generator + the model-based + computer-vision capabilities sold inside DAI bundles**.

## Available today (GA unless noted)

- **Model-based testing / digital twin** — graphical model of the application; AI explores paths, generates executable test cases. *GA in DAI.*
- **Self-healing test assets** — AI auto-adds image variants as the AUT evolves to reduce maintenance. *GA in DAI.*
- **Intelligent computer vision (image + text / OCR recognition)** — non-invasive UI testing without source-code access; high-speed CV service for iOS. *GA in EPF + DAI since 2021.*
- **AI-driven exploration + bug-hunting heatmap** — finds failure hotspots and surfaces unscripted paths. *GA in DAI.*
- **Keysight Generator (Eggplant 25.3, late 2025)** — on-prem / air-gapped GenAI converts Excel/CSV requirements into Gherkin scenarios + manual test cases; agnostic LLM, EU AI Act-aligned. *GA, current build GAI 26.2.*
- **DAI 25.3 / 26.x runtime improvements** — parallel test instances from one config, Kubernetes-hosted execution, Xray Cloud (Jira) bidirectional sync (DAI 26.1, Feb 2026), Spaces for asset/access partitioning (DAI 26.2). *GA.*

## Roadmap (late 2026 / 2027)

- **DAI 26.2 → future** — TLS-only enforcement deferred from 26.2; Spaces capability rolling out.
- **Generator** — Keysight is iterating quickly (25.3 → 26.2 in ~6 months); deeper requirements-to-automated-script (vs. just manual test cases) is the obvious next step but **not publicly named or dated**.
- **The "vendor AI release expected end of 2026" the team referenced is not findable as a named release** in public sources. It most likely refers to (a) the next Generator iteration or (b) a customer-roadmap-portal item visible only to enterprise licensees. **Open question for the Eggplant rep.**
- Independent commentary (Autonoma, peer reviews) flags that since the 2020 Keysight acquisition, AI feature pace has been **incremental, not LLM-revolution-grade** — temper expectations.

## What a DCFS tester could use today

If DCFS's Eggplant licenses include DAI + EPF (typical bundle), a tester *today* could:

1. **Cut maintenance pain with self-healing locators** — every time a SACWIS/MyDCFS UI tweak breaks an image-based step, DAI auto-substitutes the new variant instead of failing the run. Direct hit on the 80% manual-execution problem.
2. **Run AI-driven exploration on the digital twin** to surface states a human script would not visit (e.g., edge-case caseworker workflows). Pure additive coverage; zero autonomous prod execution required.
3. **Feed requirements/user stories into Keysight Generator** to spit out Gherkin + manual test cases in minutes — this is the **single most pilot-relevant capability** because it lives entirely in test-design (no governance issue) and stacks cleanly on top of Zephyr Scale Agent.
4. **Use the bug-hunting heatmap** post-run to redirect manual exploratory testing where the model says risk concentrates.
5. **Parallelize regression** via DAI 25.3's multi-instance runner — pure throughput win, no AI governance touchpoint.

## Constraints / open questions

- **Licensing tier unknown** — Generator and advanced DAI features almost certainly sit in higher SKU bundles. G2/PeerSpot anecdotes: Functional ~$16K/yr/seat, DAI bundles ~$45K. *Must confirm with the Eggplant rep what DCFS's contract actually includes — this is the §5f tool-authorization question.*
- **Public-sector references are thin** — only documented government case study found is **NASA Orion**. **No public Medicaid / child-welfare / state-HHS reference customer surfaced.** Available via TD SYNNEX Public Sector reseller channel.
- **Known weaknesses** (PeerSpot/Gartner): OCR flakiness on complex screens (~1-in-5 failure rate reported), shallow reporting, slow execution at scale, SenseTalk-only (no Java/Python), heavy installation, integration friction. The "complicated and flaky models" complaint is directly relevant to a DCFS team described as "in infancy."
- **No documented behavior on PDF-heavy or mainframe-green-screen content** — DCFS likely has both; ask the rep.
- **What is the "end of 2026" release the team heard about?** Get the named-release answer from the Eggplant account team.
- **Is Generator licensed separately from DAI?** GAI 26.2 documentation does not state.

## Bottom line for the pilot

The team's hypothesis is **half right**. The deepest tester-productivity wins (autonomous AI execution, full requirements-to-script) *are* future-state. But **three GA capabilities — self-healing, AI exploration on the digital twin, and Keysight Generator for test-case authoring — are usable inside this pilot's governance envelope today**, and Generator in particular pairs naturally with Rovo + Zephyr Scale Agent rather than competing with them. Recommend a 30-minute Eggplant rep call to confirm DCFS's license scope before treating Eggplant as purely a 2027 lever.

## Sources

- [Keysight Eggplant Test product page](https://www.keysight.com/us/en/products/software/software-testing/eggplant-test.html)
- [Keysight Eggplant Test — AI Test Case Generation / Model-Based Testing](https://www.keysight.com/us/en/products/software/software-testing/eggplant-test/model-based-testing.html)
- [Keysight blog — From Requirements to Test Cases: Generator & Eggplant 25.3](https://www.keysight.com/blogs/en/tech/software-testing/product-release/from-requirements-to-test-cases)
- [Keysight Generator landing page (2025)](https://www.keysight.com/us/en/cmp/2025/automated-test-case-design-generation-with-keysight-generator.html)
- [Eggplant Generator docs (GAI 26.2)](https://docs.eggplantsoftware.com/gai/)
- [DAI 25.3 release notes](https://docs.eggplantsoftware.com/dai/dai-release-notes-v25-3/)
- [DAI 26.1 release notes (Feb 2026)](https://docs.eggplantsoftware.com/dai/dai-release-notes-v26-1/)
- [Eggplant DAI Licensing Overview](https://docs.eggplantsoftware.com/dai/dai-license-overview/)
- [Eggplant Licensing Guide PDF](https://www.keysight.com/us/en/assets/7121-1226/ebooks/Eggplant-Licensing-Guide.pdf)
- [Keysight press release — High-Speed Computer Vision in DAI (2021)](https://www.keysight.com/us/en/about/newsroom/news-releases/2021/0211-nr21023-keysight-technologies-enhances-eggplant-digital-aut.html)
- [TD SYNNEX Public Sector — Eggplant for government](https://www.dlt.com/government-products/eggplant)
- [Gartner Peer Insights — Keysight Eggplant Test](https://www.gartner.com/reviews/market/ai-augmented-software-testing-tools/vendor/keysight/product/keysight-eggplant-test)
- [PeerSpot — Eggplant Test pros and cons](https://www.peerspot.com/products/eggplant-test-pros-and-cons)
- [G2 — Keysight Eggplant reviews / pricing](https://www.g2.com/products/keysight-eggplant/reviews)
- [TechTarget — Eggplant adds new features to AI test automation suite](https://www.techtarget.com/searchsoftwarequality/news/252465611/Eggplant-adds-new-features-to-AI-test-automation-suite)
- [Autonoma blog — Open Source Alternative to Eggplant (2026, includes critique of post-acquisition AI pace)](https://getautonoma.com/blog/opensource-alternative-eggplant)

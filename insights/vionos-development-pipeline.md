# VionOS.ai — Development Pipeline: Trampoline & FEC Safety Models

**Date:** March 2026

---

## Pipeline Stages

### Stage 1: Real Footage Collection (Week 1-2)
- Mount cameras at final positions at Launch
- Record several full operating days (weekday + weekend)
- Capture all zones: trampoline courts, ninja course, staging, walkways
- Label: normal safe jumping, crowded, empty, staff present
- Output: 50-100 hours of labeled baseline footage

### Stage 2: Violation Taxonomy (Week 1-2, parallel)
- Turn use case document into formal detection spec for ATRI
- Per violation: frame-by-frame definition, trigger threshold, false positive tolerance
- Define hard negatives (looks like violation but isn't)
- Output: Detection specification — one page per violation

### Stage 3: Synthetic Environment (Week 3-8)
- Game engine (Unreal/Unity) for critical violations (double bounce, head/neck, flips)
- GenAI video for volume on simpler violations (crowding, running, multiple jumpers)
- Pose simulation as lightweight alternative (if ATRI trains on keypoint data)
- Ask ATRI what data format they need — determines the approach
- Output: Environment capable of producing labeled violation clips on demand

### Stage 4: Synthetic Dataset Generation (Week 7-10)
- 500-1000 clips per violation type minimum
- Vary: camera angle, lighting, crowd density, body size
- Include hard negatives
- Label: bounding boxes, skeletal keypoints, violation type
- Output: Thousands of labeled clips

### Stage 5: Model Training (Week 9-14)
- Two models: pose estimation/tracking (ATRI's core) + violation classification (domain-specific)
- Pre-train on synthetic, fine-tune on real footage
- Validate on held-out real footage
- Output: Trained models with accuracy metrics

### Stage 6: Real-World Validation — Shadow Mode (Week 13-16)
- Deploy on Jetson hardware at Launch
- Run in shadow mode — log detections, don't alert staff
- Staff manually log violations during same period (ground truth)
- Compare AI vs. staff observations
- Output: Real-world accuracy report per violation type

### Stage 7: Fine-Tune on Real Violations (Week 16-24)
- Real violations become training data
- False positives become hard negatives
- Retrain, revalidate, repeat
- Ongoing cycle — sim-to-real gap closes over time
- Output: Improved models validated on real data

### Stage 8: Production + Insurance Documentation (Week 20-28)
- Switch to live alerting
- Generate daily/weekly compliance reports
- Build audit trail (every detection, alert, staff response)
- After 60-90 days, package for insurance review
- Output: Production system + insurance-ready compliance data

---

## Who Does What

| Task | Who |
|---|---|
| Camera installation, networking | USSP / Launch facilities team |
| Violation taxonomy and detection specs | USSP (domain knowledge) |
| Synthetic environment (game engine) | Developer hire/contractor or ATRI |
| GenAI synthetic data | USSP or contractor |
| Pose estimation / tracking model | ATRI |
| Violation classification model | ATRI trains, USSP defines rules/labels |
| Edge deployment (Jetson) | ATRI + USSP |
| Validation and ground truth | Launch staff + USSP |
| Insurance documentation | USSP |

---

## Cost Estimate

| Item | Estimated Cost |
|---|---|
| NVIDIA Jetson hardware (2-4 devices) | $8K - $20K |
| Camera upgrades if needed | $10K - $30K |
| 3D environment developer (6-8 weeks contract) | $15K - $30K |
| ATRI model training and deployment | TBD per agreement |
| Data labeling | $5K - $15K |
| GenAI video generation API costs | $2K - $5K |
| **Total (before ATRI fees)** | **$40K - $100K** |

---

## Timeline

| Stage | Duration |
|---|---|
| Real footage + violation taxonomy | Week 1-2 |
| Synthetic environment | Week 3-8 |
| Dataset generation | Week 7-10 |
| Model training | Week 9-14 |
| Real-world validation (shadow) | Week 13-16 |
| Fine-tune on real data | Week 16-24 |
| Production + insurance docs | Week 20-28 |
| **Total to insurance-ready** | **~6-7 months** |

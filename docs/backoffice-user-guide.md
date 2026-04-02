# USSP Back Office — User Guide

## Getting Started

### Signing In
1. Go to https://app.ussp.co (or http://localhost:3001 for local dev)
2. Click **"Sign in with Google"**
3. Use your authorized Google account

**Can't sign in?** Your email must be added to the Staff list by an admin before you can access the app. Contact an admin to add you.

### Dashboard
After signing in, you'll see the Dashboard with:
- **Active Positions** — how many jobs are live on the careers page
- **New Applications** — unprocessed applications
- **Recent Contacts** — contact form submissions in the last 7 days
- **In Progress** — applications moving through the hiring pipeline
- **Bench** — internal employees needing placement (red when > 0, shows assignments ending within 30 days)
- **Hot Positions** — top positions ranked by activity, with "Find matching candidates" link on positions with 0 apps
- **Application Pipeline** — visual breakdown by status

---

## Managing Positions

### Viewing Positions
Navigate to **Positions** in the sidebar. You'll see all positions with:
- Title, location, type, department
- Active/Closed status
- Creation date

Click any row to edit.

### Creating a Position
1. Click **"+ New Position"**
2. Fill in required fields: Title, Location, Type
3. Optional: Department, Salary Range, Description
4. Check "Active" to make it visible on the careers page
5. Click **"Create Position"**

The slug (URL-friendly name) is auto-generated from the title.

### Editing a Position
1. Click a position row in the list
2. Modify any fields
3. Uncheck "Active" to hide from the careers page (sets a closed date)
4. Click **"Save Changes"**

---

## Managing Applications

### Viewing Applications
Navigate to **Applications** in the sidebar. Filter by status using the buttons:
- **All** — show everything
- **New** — just submitted, needs review
- **Phone Screen** — initial phone screening
- **Zoom Interview** — remote interview scheduled
- **Client/In-Person Interview** — client-facing or on-site interview
- **Employment Verification** — verifying employment history
- **References** — checking references
- **Clearances** — background/security clearances
- **Offer Pending** — offer extended, awaiting response
- **Hired** — offer accepted, onboarding auto-starts
- **Rejected** / **Withdrawn** — not moving forward

You can also filter by position using the position dropdown.

### Creating a Manual Application
When a candidate sends their resume directly (email, in person, referral) instead of applying through the website:

1. Navigate to **Applications** in the sidebar
2. Click **"+ New Application"** (top-right)
3. Fill in the candidate's information:
   - **Full Name**, **Email**, **Phone** (all required)
   - **Position** — select from the dropdown (grouped by Active/Closed)
   - **Applicant Type** — Employee or Vendor
   - For Vendors: **Expected Bill Rate** (required) and **Availability Date**
4. Upload their resume (PDF, DOC, or DOCX, max 5MB) — drag & drop or click to browse
5. Click **"Create Application"**

The application is created with `auth_provider: manual` (no LinkedIn sign-in needed). You'll be redirected to the application detail page to continue the pipeline.

### Application Detail
Click any application to see:
- **Applicant profile** — name, email, phone, auth method (LinkedIn or Manual)
- **Position applied for** and application date
- **Resume** filename (if uploaded)
- **Pipeline accordion** — visual progress through 9 hiring stages
- **Matching qualifications** — how the candidate matches the position
- **Document requests** — request and track documents from the candidate
- **Other applications** — if the same person applied to multiple positions
- **Notes** — add internal notes visible only to staff

### Advancing Through the Pipeline
On the application detail page, use the pipeline accordion in the right sidebar:
- Click **"Advance"** to move to the next stage
- Click any specific stage to jump directly to it
- Click **"Deactivate"** to reject the application
- **Gate warnings** appear when documents are missing:
  - Resume required to advance past New Application
  - References must be submitted before advancing past References
  - SSN and Visa/Work Authorization required before Offer Pending
- Click **"Advance Anyway"** to override (admin/recruiter only — override is audit-logged)

### Adding Notes
Type a note in the text field and press Enter or click "Add". Notes are timestamped with your name and visible to all staff. You can edit or delete notes by hovering over them.

---

## Viewing Contacts

Navigate to **Contacts** in the sidebar. This shows all contact form submissions from the public website.

Click any row to see the full message in a popup.

*Contacts are read-only — they cannot be edited or deleted from the back office.*

---

## Managing Staff

### Viewing Staff
Navigate to **Staff** in the sidebar. You'll see all staff users with their role, active status, and last login date.

### Adding Staff
1. Click **"+ Add Staff"**
2. Enter their full name and Google email address
3. Select a role:
   - **Recruiter** — manage positions and applications
   - **Sales** — manage contacts and view applications
   - **HR Manager** — manage applications and view staff
   - **Viewer** — read-only access
   - **Admin** — full access
4. Click **"Add Staff"**

The user can now sign in with their Google account.

### Role Permissions

| Action | Admin | Recruiter | Sales | HR Manager | Viewer |
|--------|-------|-----------|-------|------------|--------|
| View dashboard | Yes | Yes | Yes | Yes | Yes |
| Create/edit positions | Yes | Yes | No | No | No |
| Manage applications | Yes | Yes | No | Yes | No |
| Create manual applications | Yes | Yes | No | Yes | No |
| View applications | Yes | Yes | Yes | Yes | Yes |
| Manage candidates | Yes | Yes | No | No | No |
| Manage clients/end clients | Yes | Yes | No | No | No |
| Manage contacts | Yes | No | Yes | No | No |
| View contacts | Yes | Yes | Yes | No | Yes |
| Manage articles | Yes | No | Yes | No | No |
| Manage staff | Yes | No | No | No | No |
| View staff | Yes | No | No | Yes | Yes |

---

## Candidate Matching

The system includes an 8-dimension rule-based matching engine that scores candidates against position requirements.

### Running a Match
1. Navigate to a **Position detail page**
2. Scroll to the **Candidate Matching** section
3. Click **"Find Matching Candidates"** to score all candidates
4. Results appear ranked by score with strengths/gaps highlighted

You can also trigger matching from the dashboard by clicking on a hot position with 0 applications.

### Match Dimensions (weighted scoring)
| Dimension | Weight | What It Checks |
|-----------|--------|---------------|
| Skills | 30% | Required & preferred skills vs. resume extracted skills |
| Experience | 20% | Years of experience vs. position min/max |
| Location | 10% | Candidate location + work preference vs. position location/work mode |
| Education | 10% | Degree level vs. position education requirement |
| Certifications | 8% | Professional certs vs. required certifications |
| Availability | 8% | Candidate status + assignment end dates |
| Resume Recency | 7% | How recently the resume was uploaded |
| Rate Compatibility | 7% | Salary expectations vs. position bill rate/salary range |

### Filtering Results
- **All / Internal / Bench** — filter to see only internal employees
- **"Internal first" checkbox** — sorts internal candidates to the top
- Click any row to expand the full dimension breakdown
- Click **"View Candidate"** to go to the candidate profile

### Work Preference Impact
Candidate work preferences (set on the candidate profile) affect location scoring:
- **Remote Only** candidates are penalized for on-site/hybrid positions (score: 20)
- **Open to Travel** candidates get boosted for location mismatches (score: 60-80)
- **Hybrid/On-site** candidates are scored normally by city/state matching

---

## Managing Candidates

### Adding a Candidate
1. Navigate to **Candidates** in the sidebar
2. Click **"+ Add Candidate"**
3. Select candidate type: **Internal Employee**, **External**, or **Vendor**
4. Fill in name, email, phone, location, work preference, source
5. Optionally set salary expectations
6. Click **"Add Candidate"**

### Editing Candidate Details
On the candidate detail page, the **Quick Info sidebar** has editable dropdowns for:
- **Type** — change between Internal Employee / External / Vendor
- **Status** — Available (Bench) / Employed / On Assignment / Not Looking / Blacklisted
- **Location** — free text (e.g. "Chicago, IL") — used in matching
- **Work Preference** — Remote Only / Hybrid / On-site / Open to Travel
- **Source** — how the candidate entered the system

---

## Bench Management

The **Bench** page tracks internal employees who need placement. Access it from the sidebar.

### On Bench Now
Shows internal employees with status "Available" — these need immediate placement. Each row shows:
- Name, location, work preference, salary rate, bench duration
- **"Find Positions"** button to search for matching open positions

### Coming Off Assignment
Shows internal employees on active assignments, sorted by end date (soonest first). Urgency color coding:
- **Red** — 14 days or less (or overdue)
- **Amber** — 15-30 days
- **Yellow** — 31-60 days
- **Blue** — 60+ days

Employees with assignments ending within 60 days show a **"Find Next Role"** button.

### Summary Cards
- **On Bench Now** (red) — count needing immediate placement
- **Ending in 30 days** (amber) — assignments expiring soon
- **On Assignment** (blue) — total internal employees currently placed

---

## Managing Assignments

### Viewing Assignments
Navigate to **Assignments** in the sidebar. Filter by status: Active, Completed, Terminated, On Hold. Assignments expiring within 30 days show a warning icon.

### Creating an Assignment
1. Click **"+ New Assignment"**
2. Select the **Employee/Candidate** (filtered to internal employees)
3. Enter the **Role Title**
4. Optionally link to a tracked **Position**
5. Select **Client** and **End Client**
6. Set **Start Date** and **End Date**
7. Enter **Bill Rate** and **Pay Rate** ($/hr)
8. Add any **Notes**
9. Click **"Create Assignment"**

The candidate's status is automatically updated to "On Assignment" when the assignment is created.

---

## Candidate Onboarding

When an application reaches **Hired**, an onboarding checklist is automatically created on the candidate record. Navigate to the candidate detail page to see it in the sidebar.

### Onboarding Steps
Each onboarding has three steps that can be updated independently:
1. **I-9 / E-Verify** — employment eligibility verification
2. **Background Check** — criminal, employment history, credential verification
3. **Orientation & Training** — company policies, client training, compliance

### Updating Onboarding
- Change each step's status using the dropdown: Not Started → In Progress → Completed
- When all three steps are marked **Completed**, the onboarding automatically completes
- A progress bar shows overall completion

### Candidate Detail Page
The candidate detail page shows:
- **Quick Info sidebar** — editable type, status, location, work preference, source
- **Salary Expectations** — min/max with hourly or annual type (used in rate matching)
- **Certifications** — professional certifications with recruiter verification (used in matching)
- **Identity Documents** — encrypted PII (SSN, Driver's License, DOB, Visa/Work Authorization)
- **Applications** — all positions the candidate applied to
- **Onboarding** — post-hire checklist (when applicable)

---

## Superadmins

The following emails are auto-created as admins on first login — no manual setup needed:
- vinay@lagisetty.com
- swapan@lagisetty.com
- arjun@lagisetty.com

---

## Troubleshooting

### "Access denied" on sign-in
Your email isn't in the staff list. Ask an admin to add you at `/staff/new`.

### "Forbidden" error on an action
Your role doesn't have permission for that action. Ask an admin to upgrade your role.

### Changes not showing on careers page
Make sure the position is set to **Active**. Inactive positions are hidden from the public site.

### Can't see the back office at all
- Verify you're going to `app.ussp.co` (not `www.ussp.co`)
- Clear your browser cookies and try again
- Check that the Railway `app` service is deployed and running

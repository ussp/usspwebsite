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
- **Salary Expectations** — min/max with hourly or annual type
- **Certifications** — professional certifications with recruiter verification
- **Identity Documents** — encrypted PII (SSN, Driver's License, DOB, Visa)
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

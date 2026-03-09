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
- **Screening** — resume/phone screen in progress
- **Interview** — candidate is interviewing
- **Offer** — offer extended
- **Hired** — accepted and onboarded
- **Rejected** / **Withdrawn** — not moving forward

### Application Detail
Click any application to see:
- **Applicant profile** — name, email, phone, LinkedIn info
- **Position applied for** and application date
- **Resume** filename (if uploaded)
- **Current status** with ability to change it
- **Notes** — add internal notes visible only to staff

### Changing Status
On the application detail page, click the desired status in the right sidebar. The change takes effect immediately.

### Adding Notes
Type a note in the text field and press Enter or click "Add". Notes are timestamped with your name and visible to all staff.

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
| View applications | Yes | Yes | Yes | Yes | Yes |
| Manage contacts | Yes | No | Yes | No | No |
| View contacts | Yes | Yes | Yes | No | Yes |
| Manage staff | Yes | No | No | No | No |
| View staff | Yes | No | No | Yes | Yes |

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

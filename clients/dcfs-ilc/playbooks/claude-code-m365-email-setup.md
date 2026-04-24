# Setting up Claude Code as Your Krasan (M365) Productivity Agent

> **Audience:** Any Krasan consultant who wants Claude Code to read/draft email, check calendar, send Teams messages, and run background tasks using their Krasan M365 account.
> **Time required:** ~20–30 minutes (plus waiting time if IT admin consent is needed).
> **Prerequisites:** A Krasan M365 email account, Claude Code installed, and ability to register applications in the Krasan Entra ID (Azure AD) tenant — OR a contact in Krasan IT who can do it for you.

> ## ⚠️ KNOWN ISSUE — READ BEFORE STARTING
>
> **Even after admin consent is granted and the Enterprise Application is correctly configured, the first device-code sign-in may still fail with "Need admin approval" or similar policy errors.**
>
> This was observed during initial rollout on 2026-04-24 (first setup for `vinay.lagisetty@krasanconsulting.com`). Neither of the documented fixes below resolved it on their own:
> - Admin consent granted (13/13 permissions showing green "Granted for Krasan Consulting Services")
> - Enterprise App Properties confirmed: "Enabled for users to sign-in" = Yes, "Assignment required" = No
>
> **The only workaround that worked:** Krasan IT had to grant the user **temporary elevated admin access** in Entra ID. Once elevated, the device-code sign-in completed successfully and tokens cached normally. The elevation can then be removed — the cached refresh token continues to work for ~90 days without needing admin rights.
>
> **Root cause is not yet identified.** Suspected: a tenant-level Conditional Access or app-governance policy that blocks first-time delegated consent for new apps from non-admin users, regardless of per-app assignment settings. Needs investigation with Krasan IT to find the exact policy so future users don't need elevated access.
>
> **For now, the IT ask is two-part:**
> 1. Grant admin consent on the app registration's API permissions (permanent)
> 2. Grant the user temporary elevated access (Global Admin or Cloud Application Administrator role) for ~15 minutes to complete the first sign-in, then remove
>
> Update this playbook once the root-cause policy is identified.

---

## What this sets up

After following this guide, you'll be able to ask Claude Code things like:

**Email:**
- *"List the last 10 emails in my inbox"*
- *"Draft a reply to the latest message from [person]"*
- *"Search my email for anything about the DCFS kickoff meeting"*
- *"Summarize unread emails from this week"*

**Calendar:**
- *"What's on my calendar tomorrow?"*
- *"Find a 30-min slot next week when Jim and I are both free"*
- *"Create a meeting with Romi Friday at 2pm, Teams call, topic: DCFS status"*

**Teams chat:**
- *"Message Alec on Teams: I'll send the status update by EOD"*
- *"Read my recent Teams DMs and flag anything urgent"*

**Directory & contacts:**
- *"Email my frequent DCFS contacts a meeting invite for next Friday"*
- *"Find [person's] email address"*

**Background agent (with scheduled runs):**
- Daily morning inbox + calendar digest
- End-of-day status draft based on your meetings and emails
- Hourly urgent-email sweep during working hours

This uses the **Microsoft 365 MCP server** (an open-source connector) that Claude Code talks to, which in turn talks to your mailbox via the Microsoft Graph API.

### How it works (conceptually)

```
Claude Code  ⇆  ms-365-mcp-server  ⇆  Microsoft Graph API  ⇆  Your Krasan mailbox
```

The MCP server runs locally on your machine. It authenticates using **device code flow** — you sign in once in a browser with your Krasan account, and a refresh token is cached locally so Claude Code can keep acting on your behalf.

---

## Step 1: Register an Azure AD application

This tells Microsoft "here's an app that Vinay is going to use to access his own mailbox."

### 1a. Create the registration

1. Go to https://entra.microsoft.com
2. Sign in with your Krasan account
3. Left nav → **Applications** → **App registrations**
4. Click **+ New registration**
5. Fill in:
   - **Name:** `CC-<YourFirstName>` (e.g. `CC-Vinay`) — this is just a label, you can change it later
   - **Supported account types:** **"Single tenant only - Krasan Consulting Services"**
   - **Redirect URI:**
     - Platform dropdown → **Public client/native (mobile & desktop)**
     - URI → `http://localhost`
6. Click **Register**

You'll land on the **Overview** page. **Copy and save these two values** — you'll need them in Step 3:

| Value | Where to find it |
|---|---|
| **Application (client) ID** | Overview page, top section |
| **Directory (tenant) ID** | Overview page, top section |

Both are UUIDs like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

### 1b. Enable public client flows

This is what allows device-code authentication to work (no client secret needed).

1. Left sidebar → **Authentication**
2. Click the **Settings** tab (top of page)
3. Under **"Allow public client flows"**, toggle to **Enabled**
4. Click **Save**

Verify the Redirect URI is still set correctly:
1. Click the **Redirect URI configuration** tab
2. You should see `http://localhost` listed under **Mobile and desktop applications**
3. If it's missing or under "Web" instead — click **+ Add Redirect URI**, select **Mobile and desktop applications**, add `http://localhost`, save

### 1c. Add Microsoft Graph API permissions

1. Left sidebar → **API permissions**
2. You'll see `User.Read` already there — leave it
3. Click **+ Add a permission**
4. Click **Microsoft Graph**
5. Click **Delegated permissions** (⚠️ NOT "Application permissions")
6. Search for and check each of these:

   **Core (Mail):**
   - `Mail.Read` — read your inbox
   - `Mail.ReadWrite` — mark read/unread, move, flag, delete
   - `Mail.Send` — send and reply to email
   - `offline_access` — get a refresh token so you only sign in once every ~90 days

   **Calendar:**
   - `Calendars.ReadWrite` — read calendar, create/update/delete events

   **Teams chat:**
   - `Chat.ReadWrite` — read/send 1:1 and group chat messages (does NOT include channel messages — those use a different permission model)

   **Directory lookup (so Claude can find colleagues by name):**
   - `User.ReadBasic.All` — resolve a name like "Jim Daugherty" to an email address
   - `People.Read` — your frequent contacts / people you email often

   **OneDrive files (optional but useful for saving drafts/digests):**
   - `Files.ReadWrite` — your own OneDrive files (scoped to you only)

   **Personalization (recommended for background agent):**
   - `MailboxSettings.Read` — lets Claude read your email signature so drafted replies match your style
   - `Presence.Read.All` — see colleagues' Teams availability (useful for "find a time when X is free")
   - `Presence.ReadWrite` — optionally let Claude set your own presence (e.g., "busy" during focus blocks)

7. Click **Add permissions** at the bottom

You should now have **13 permissions** in the list (12 you added + the default `User.Read`).

> ### Why delegated, not application?
>
> Delegated = acts as *you*, scoped to *your* mailbox only. This is what you want for a personal productivity tool.
>
> Application permissions grant tenant-wide access (any user's mailbox) and are typically blocked by IT. Even for "background" use cases, delegated + refresh token is the right answer — the token lets Claude act on your behalf for ~90 days without you being signed in.
>
> If IT ever pushes back on a permission, you can trim this list. **The minimum viable bundle for email alone is:** `Mail.Read`, `Mail.ReadWrite`, `Mail.Send`, `offline_access`, `User.Read`. Everything else is additive.

### 1d. Grant admin consent

At the top of the API permissions page (toolbar row), click **"Grant admin consent for Krasan Consulting Services"** → **Yes**.

The **Status** column should flip from "No" → green checkmark **"Granted for Krasan Consulting Services"** for all 13 rows.

> ### ⚠️ If "Grant admin consent" is greyed out
>
> You don't have tenant admin rights — which is normal for most consultants. You need IT to approve the app on your behalf. Send Krasan IT an email like this:
>
> ---
> **Subject:** Admin consent request — Claude Code M365 productivity integration
>
> Hi IT team,
>
> I've registered an Entra ID application in our Krasan tenant for personal productivity use (connecting my Krasan M365 account to Claude Code for AI-assisted email drafting, calendar management, and Teams messaging). I need admin consent granted for the following **delegated** Microsoft Graph permissions:
>
> **Mail:** `Mail.Read`, `Mail.ReadWrite`, `Mail.Send`
> **Calendar:** `Calendars.ReadWrite`
> **Teams chat:** `Chat.ReadWrite`
> **Directory:** `User.Read`, `User.ReadBasic.All`, `People.Read`
> **Files:** `Files.ReadWrite`
> **Personalization:** `MailboxSettings.Read`, `Presence.Read.All`, `Presence.ReadWrite`
> **Token refresh:** `offline_access`
>
> All permissions are **Delegated** — the app acts on my behalf only, scoped to my account. It cannot access other users' mailboxes or data. No Application permissions are requested.
>
> **App details:**
> - Name: `CC-<YourName>`
> - Application (client) ID: `<paste client ID here>`
> - Tenant: Krasan Consulting Services (single-tenant)
>
> The app's API permissions page: https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/~/CallAnAPI/appId/`<paste client ID>`
>
> Happy to walk through what the app does if helpful — the intent is to let an AI assistant draft emails, summarize my inbox, and schedule meetings on my behalf during DCFS project work.
>
> Thanks,
> `<Your Name>`
>
> ---
>
> Once they've granted consent, continue with Step 2.

> ### 🔒 Minimum-viable request (if IT pushes back on the full list)
>
> If IT balks at the full 12-permission request, the absolute minimum for email-only usage is:
> - `Mail.Read`, `Mail.ReadWrite`, `Mail.Send`, `offline_access` (plus the default `User.Read`)
>
> Start with those. You can always add the others later via the same app registration without creating a new app — just come back to API permissions, add the new permission, and request admin consent again for that specific permission.

---

## Step 2: Install the MCP server in Claude Code

The MCP server is an npm package (`@softeria/ms-365-mcp-server`). `npx` will pull it on demand — you don't need to install it globally.

### Prerequisites

- **Node.js 18+** installed (`node --version` to check)
- **Claude Code CLI** installed (`claude --version` to check)

### Register it

Open a terminal and run (substituting the two IDs you saved in Step 1a):

```bash
claude mcp add-json -s user ms365 '{"command":"npx","args":["-y","@softeria/ms-365-mcp-server"],"env":{"MS365_MCP_CLIENT_ID":"<your-client-id>","MS365_MCP_TENANT_ID":"<your-tenant-id>"}}'
```

> **Why `add-json` not `add -e KEY=VAL`?**
> Claude Code's `-e` flag is variadic — when you pass multiple `-e` flags, the parser can get confused about where the env list ends and the server name begins. `add-json` takes a single JSON string, which avoids the ambiguity. Both produce the same result.

**Notes on flags:**
- `-s user` → installs at **user scope**, so the MCP is available in all your Claude Code projects (not just one repo)
- `ms365` → the short name you'll see in the MCP server list
- The JSON blob describes how to launch the server (`command` + `args`) and what env vars to set

### Verify it registered

```bash
claude mcp list
```

You should see `ms365` in the list. It'll likely show **`✗ Failed to connect`** or **`! Needs authentication`** — both are expected at this stage:
- "Failed to connect" just means your current Claude Code session hasn't spawned the server yet (sessions load MCP servers at startup, not when you add them)
- You'll authenticate on first use in Step 3

### ⚠️ Restart Claude Code before Step 3

MCP servers registered via `claude mcp add-json` only become available in **new** Claude Code sessions. **Exit your current session** (`/exit` or close the terminal) and reopen it before continuing. The `ms365` tools won't appear in the currently-running session.

---

## Step 3: First-run authentication (device code flow)

1. **Restart Claude Code** so it picks up the new MCP server
2. Start a new conversation
3. Ask Claude: *"List the 5 most recent emails in my inbox"*

The first time any email tool is invoked, the MCP server will print a message like:

```
To sign in, use a web browser to open the page https://microsoft.com/devicelogin
and enter the code ABCD-1234 to authenticate.
```

**What to do:**
1. Open https://microsoft.com/devicelogin in your browser
2. Enter the code shown
3. Sign in with your Krasan M365 email (e.g. `vinay.lagisetty@krasanconsulting.com`)
4. Approve the permissions requested
5. Close the browser tab

Claude Code will now have an **access token + refresh token** cached locally (typically in `~/.ms-365-mcp-server/` or similar). It should automatically proceed with your request and return the list of emails.

**This only happens on first use.** Subsequent sessions use the cached refresh token silently.

---

## Step 4: Test it

Try these prompts to confirm each permission bundle works:

| Prompt | What it tests |
|---|---|
| *"List my 10 most recent emails"* | `Mail.Read` |
| *"Search my email for 'DCFS kickoff'"* | Search |
| *"Draft a reply to the latest email from [name]"* | Draft generation |
| *"What's on my calendar tomorrow?"* | `Calendars.ReadWrite` (read path) |
| *"Find a 30-min slot next Tuesday afternoon"* | Calendar + availability |
| *"Create a meeting Friday at 2pm titled 'DCFS status'"* | Calendar write |
| *"Send a Teams message to [colleague]: I'll be 10 minutes late"* | `Chat.ReadWrite` |
| *"Find [name]'s email address"* | `User.ReadBasic.All` |
| *"Who do I email most frequently?"* | `People.Read` |
| *"What's my current email signature?"* | `MailboxSettings.Read` |
| *"Is [colleague] currently available on Teams?"* | `Presence.Read.All` |

---

## Step 5 (optional): Set up a background agent

Now that Claude can read your mail and calendar, you can have it run scheduled tasks — e.g., a morning digest, end-of-day summary, or hourly urgent-email sweep.

### Approach: Windows Task Scheduler + Claude Code non-interactive mode

Claude Code supports a non-interactive mode via `claude -p "prompt"` — perfect for scheduled runs. Combined with your local MCP server, Claude can read your mailbox, run any task you've templated, and write output to a file (or email it back to you).

### Example: Morning digest at 7am

**1. Create a prompt file** — `C:\Users\<you>\claude-tasks\morning-digest.txt`:

```
Using my M365 account, do the following:

1. Fetch all unread emails from my inbox received after 6pm yesterday
2. Fetch today's calendar events
3. For each email: summarize in one sentence, flag as [URGENT] if from my manager or contains words like "blocker", "asap", "urgent"
4. Produce a markdown digest with sections: "Today's Meetings", "Unread Email (X)", "Action Items"
5. Write the output to C:\Users\<you>\claude-tasks\digests\YYYY-MM-DD-morning.md
6. Then email the digest to me at vinay.lagisetty@krasanconsulting.com with subject "Morning digest - YYYY-MM-DD"
```

**2. Create a wrapper script** — `C:\Users\<you>\claude-tasks\run-morning-digest.ps1`:

```powershell
$date = Get-Date -Format "yyyy-MM-dd"
$prompt = Get-Content C:\Users\<you>\claude-tasks\morning-digest.txt -Raw
$prompt = $prompt -replace 'YYYY-MM-DD', $date

claude -p $prompt --dangerously-skip-permissions 2>&1 |
  Out-File "C:\Users\<you>\claude-tasks\logs\$date-morning.log"
```

**3. Register with Task Scheduler:**

- Open Task Scheduler → Create Basic Task
- Name: `Claude - Morning Digest`
- Trigger: Daily at 7:00 AM (on weekdays if you prefer)
- Action: Start a program
  - Program: `powershell.exe`
  - Arguments: `-NoProfile -ExecutionPolicy Bypass -File "C:\Users\<you>\claude-tasks\run-morning-digest.ps1"`
- In the task's Properties → General tab, check **"Run whether user is logged on or not"**

Your laptop must be on (or waking on schedule) for this to run. For truly always-on operation, use a dedicated always-on machine or accept that digests only happen on days when your laptop is awake.

### Common scheduled-agent patterns

| Schedule | Task |
|---|---|
| Weekdays 7am | Morning digest (today's calendar + overnight email summary) |
| Weekdays 5pm | End-of-day status: draft a summary of meetings held and emails received, as a Teams message to yourself |
| Every hour 9–5 | Urgent-email sweep: scan for emails from key stakeholders, alert if found |
| Fridays 4pm | Weekly retrospective: summarize the week's emails + calendar, suggest follow-ups for Monday |

### Security notes for background runs

- `--dangerously-skip-permissions` is needed because scheduled tasks can't interactively approve tool calls. This means the agent can call *any* tool you've configured. Keep your MCP server list tight.
- Any file paths / email addresses hardcoded in your prompt template are sensitive only in the sense that anyone with access to your laptop can read them. Store in your user profile directory (already only readable by you) and you're fine.
- **Don't auto-send replies.** Have the agent draft-to-folder or email drafts back to you for review. Auto-send is a one-typo-from-disaster pattern.

---

## Troubleshooting

### "The user or administrator has not consented to use the application"

Admin consent wasn't granted in Step 1d. Go back to Azure → your app → API permissions, verify the status column, and get admin consent.

### "AADSTS50020" or similar tenant errors

Double-check `MS365_MCP_TENANT_ID` — it should be **your Krasan tenant ID**, not `common` or `organizations`. Re-run `claude mcp remove ms365 -s user` and re-add with the correct tenant ID.

### Device code shown but browser sign-in fails with "Need admin approval"

This is the **known issue** flagged at the top of this document. Even after you've done everything right — admin consent granted (green checkmarks on all 13 perms), Enterprise App Properties correctly set, "Assignment required" = No — the first device-code sign-in may still fail with this error.

**Confirmed workaround (observed 2026-04-24, vinay.lagisetty@krasanconsulting.com):**

1. Ask Krasan IT to grant you **temporary elevated admin access** in Entra (Global Admin or Cloud Application Administrator role) — duration ~15 minutes is enough
2. While elevated, request a fresh device code in Claude Code (`login` with force=true)
3. Complete the browser sign-in — it will now work; you'll see the normal consent page listing 13 permissions and can click **Accept**
4. Verify the login succeeded (`verify-login` tool returns `success: true`)
5. Ask IT to remove the elevation — your cached refresh token continues to work for ~90 days without admin rights

**What did NOT fix this alone** (all of these were in place but sign-in still failed):

- ✓ Admin consent granted on App Registration → API permissions (all 13 showing green "Granted for Krasan Consulting Services")
- ✓ Enterprise Application → Properties → "Enabled for users to sign-in" = Yes
- ✓ Enterprise Application → Properties → "Assignment required" = No

**Root cause not yet identified.** Suspected a tenant-level Conditional Access policy or app governance rule that blocks first-time delegated consent from non-admin users regardless of per-app assignment. **TODO for Krasan IT:** identify the policy so future users don't need elevation.

**In the meantime**, the IT ask has two parts:
1. Grant admin consent on the app's API permissions (permanent, one-time)
2. Grant the user temporary elevated access for ~15 minutes to complete first sign-in, then remove

### Policy-level "Need admin approval" (different issue)

If you're seeing "Need admin approval" and admin consent was genuinely *not* granted (Status column in API permissions still shows "No" instead of green), this is the simpler case — IT needs to click the **"Grant admin consent for Krasan Consulting Services"** button at the top of the API permissions page. See Step 1d.

### MFA loops / "your organization requires a managed device"

Krasan may require you to be on a compliant/Intune-enrolled device. Run Claude Code from your Krasan-issued laptop, not a personal machine.

### Tokens expired / "invalid_grant"

Refresh tokens expire after ~90 days of inactivity. Delete the cached token file (location depends on the MCP server version — check `~/.ms-365-mcp-server/`, `%APPDATA%\ms-365-mcp-server\`, or similar) and go through device code auth again.

### Want to revoke access entirely

Go to https://myaccount.microsoft.com → **Apps & services** → find your app by name → **Revoke**. All cached tokens become invalid immediately. Then delete the app registration in Entra if you don't want to reuse it.

---

## Security notes

- **Delegated scope only.** This app can only access **your own mailbox** — it cannot read other employees' mail, regardless of what Claude Code does.
- **Token storage is local.** Refresh tokens live on your machine. If your laptop is compromised, revoke access immediately via the link above.
- **No client secret.** Public client flow means there's no long-lived secret to leak. Your Krasan password + MFA is still the gate.
- **Audit trail.** Every Graph API call is logged in Entra sign-in logs. IT can see what the app did if they ever need to audit.
- **Scope minimization option.** If `Mail.ReadWrite` makes you nervous (it allows deletion/modification), drop it and keep only `Mail.Read` + `Mail.Send`. You lose mark-as-read / move / flag capabilities but nothing can delete.

---

## Maintenance

### Updating the MCP server

`npx -y @softeria/ms-365-mcp-server` automatically fetches the latest published version each time Claude Code starts it. No manual updates needed.

### Removing the integration

```bash
claude mcp remove ms365 -s user
```

Then revoke the app in https://myaccount.microsoft.com and delete the Entra app registration.

### Using on multiple machines

The Entra app registration works for all your machines — you don't need to re-register. Just run Step 2 on each machine and go through device code auth on Step 3. Each machine caches its own token.

---

## Appendix: Where the credentials live

| Credential | Stored where | Can be rotated? |
|---|---|---|
| Client ID | `.env` file + `claude mcp add` env var | Create new app if compromised |
| Tenant ID | `.env` file + `claude mcp add` env var | Fixed per tenant, not a secret |
| Access token | Local MCP server cache | Auto-refreshed by server |
| Refresh token | Local MCP server cache | Revoke via myaccount.microsoft.com |

Client ID and Tenant ID are **not secrets** on their own — they're identifiers. Without your Krasan password + MFA, they're useless to an attacker. It's safe to share them with IT or teammates setting up the same integration.

---

## Questions?

Ping Vinay (`vinay.lagisetty@krasanconsulting.com`) or the #claude-code channel (if it exists — otherwise file under "suggestion").

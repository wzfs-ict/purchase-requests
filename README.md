# WZFS Purchase Requests

Heads of Department submit purchase requests. The Principal reviews them and adds comments, then forwards them. The Chairman makes the final decision.

- **This website (GitHub Pages)** is only the screen people use. It contains **no data**.
- **All data lives in a private SharePoint site** at the school. People sign in with their school Microsoft account.
- **SharePoint enforces privacy**, not this website. Each HoD can read only the items they created. The Principal and Chairman can read everything.

| Who | What they see | What they can do |
|---|---|---|
| HoD (PE, Humanities, Science, Upper School, Primary, Mathematics) | Only their own requests | Add, edit, delete, save as draft, submit, download Excel |
| Principal | All submitted requests | Recommendation and comment on each item, then forward to the Chairman |
| Chairman | Forwarded requests, with the Principal's comments | Approve / approve with changes / reject / defer, set the approved amount, add a note, print, download Excel |

---

## One-time setup (about 20 minutes, needs a SharePoint site owner)

### 1. Create the private SharePoint site
1. Go to SharePoint, then **+ Create site** → **Team site** (or a private Team in Teams).
2. Name it **Purchase Requests** so the address is `https://weihaizhongshi.sharepoint.com/sites/PurchaseRequests`. Set Privacy to **Private**.
3. Add the **Principal** and **Chairman** as **Owners**. Do **not** add HoDs as members. They get access to one list only, in step 5.

### 2. Register the app in Microsoft Entra
1. Go to <https://entra.microsoft.com>, then **App registrations** → **New registration**.
2. Name: `WZFS Purchase Requests`. Accounts: **this organisation only**.
3. Redirect URI: platform **Single-page application (SPA)**, URI `https://wzfs-ict.github.io/purchase-requests/`
4. Click **Register**, then copy the **Application (client) ID**.
5. **API permissions** → Add → Microsoft Graph → **Delegated**: `User.Read`, `Sites.ReadWrite.All`, `Sites.Manage.All`.
   If your tenant requires it, click **Grant admin consent**.

> If you can't register apps, ask the Microsoft 365 admin to do step 2 and send you the client ID.

### 3. Fill in `config.js`
Edit `config.js` in this repo (pencil icon on GitHub):
- `clientId`: the ID from step 2
- `principals`: the Principal's school email
- `chairmen`: the Chairman's school email
- `hods`: optional. Tie each HoD's email to their department so they can't pick another one.

### 4. Create the lists
Open the website and sign in as an admin. On the **Setup** tab, click **Create the missing lists**. Approve the extra permission prompt; if it sends you back, click the button again. This creates:
- **Purchase Requests**: one row per item
- **Purchase Reviews**: Principal comments and Chairman decisions

### 5. Lock down privacy (most important)
The Setup tab has direct links for each of these:
1. **Purchase Requests → List settings → Advanced settings**
   - Read access: **Read items that were created by the user**
   - Create and Edit access: **Create items and edit items that were created by the user**
2. **Purchase Requests → Permissions for this list** → **Stop Inheriting Permissions**
   - Remove Members and Visitors.
   - Grant HoDs **Contribute**. Never Edit, Design or Full Control: those levels can bypass the "own items only" rule.
   - Principal and Chairman: **Full Control**.
3. **Purchase Reviews → Permissions** → **Stop Inheriting Permissions**. Only the Principal and Chairman (Full Control) should have access. HoDs get none.

### 6. Test
- Two HoDs each add one test item. Each should see **only their own** item.
- The Principal sees both, comments and forwards.
- The Chairman sees them under **Report & decisions**.
- Delete the test items afterwards.

### 7. Notifications (Power Automate)
Follow [FLOWS.md](FLOWS.md) to add two flows:
- a weekday digest of new requests to the Principal
- a Monday reminder to the Chairman of items awaiting a decision

---

## Good to know
- **Quotes and receipts:** HoDs upload the file to their own OneDrive, share it with the Principal and Chairman, and paste the link into the form.
- **Edited after decision:** if a HoD changes an item after the Chairman has decided, a warning badge appears next to it.
- **History:** SharePoint keeps version history on both lists (List settings → Versioning).
- **HoDs don't see decisions in the app.** The Principal or Chairman tells them the outcome. This could be added later.
- **Admins** can use the "View as" menu to preview the HoD, Principal or Chairman screens. This only changes the layout. It never shows data that SharePoint doesn't already allow.
- **Access from China:** github.io loads slowly or not at all on some networks. If it's unreliable, the same files can be hosted on Azure Static Web Apps. Only the redirect URI in step 2 changes.

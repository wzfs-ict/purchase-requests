# Power Automate flows

| Flow | When | To | What |
|---|---|---|---|
| 1. Daily digest | Weekdays 15:30 Beijing | Principal (asumeg-ang@) | New requests submitted since the last digest, as a table with the total |
| 2. Chairman reminder | Mondays 08:00 Beijing | Chairman (mlee@) | Forwarded items still **Pending**, as a table with the total |

Each flow has only 5 steps. Build them while signed in as **glenj@** (a site owner, so the flows can read every item).

**Site Address** in every SharePoint step: `https://weihaizhongshi.sharepoint.com/sites/PurchaseRequests`

> **How to enter an expression:** click in the box → click the **fx** button (or type `/` and choose **Insert expression**) → paste the expression → **Add**.

---

## Flow 1: Daily digest to the Principal

**Create → Scheduled cloud flow**
- Name: `Purchase Requests - daily digest`
- Repeat every **1 Week**
- Click **Create**

**1. Recurrence** (click the trigger, then **Show all / Advanced parameters**)
- Time zone: **(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi**
- On these days: **Monday … Friday**
- At these hours: `15`. At these minutes: `30`

**2. + → SharePoint → Get items**
- Site Address: the address above. List Name: **Purchase Requests**
- **Filter Query:** type `RequestStatus eq 'Submitted' and SubmittedAt ge '` then insert this **expression**, then type a closing `'`:
  ```
  addDays(utcNow(), if(equals(dayOfWeek(utcNow()),1), -3, -1))
  ```
- Order By: `Department`
- Top Count: `500`

**3. + → Control → Condition**
- Left (expression): `length(outputs('Get_items')?['body/value'])`
- Operator: **is greater than**. Right: `0`

**4. In True: + → Data Operation → Create HTML table**
- From: **value** (dynamic content from *Get items*)
- Columns: **Custom**. Add these rows (header, then value as an **expression**):

| Header | Value (expression) |
|---|---|
| Department | `item()?['Department']?['Value']` |
| Item | `item()?['Title']` |
| Qty | `item()?['Quantity']` |
| Total ¥ | `formatNumber(item()?['LineTotal'],'N0')` |
| Priority | `item()?['Priority']?['Value']` |
| Reason | `item()?['Reason']` |
| From | `item()?['Author']?['DisplayName']` |

**5. In True: + → Office 365 Outlook → Send an email (V2)**
- To: `asumeg-ang@zhongshischool.org`
- Subject: `New purchase requests to review`
- Body: click **</>** (code view) and paste:
  ```html
  <p>Dear Mr Sumeg-ang,</p>
  <p>These purchase requests were submitted since the last digest:</p>
  @{body('Create_HTML_table')}
  <p><a href="https://wzfs-ict.github.io/purchase-requests/">Open Purchase Requests to review</a></p>
  ```

**Save**, then **Test → Manually → Run flow**. You'll only get an email if something has been submitted in the last day.

---

## Flow 2: Monday reminder to the Chairman

**Create → Scheduled cloud flow**
- Name: `Purchase Requests - Chairman reminder`
- Repeat every **1 Week**
- Click **Create**

**1. Recurrence**
- Time zone: **Beijing** (as above)
- On these days: **Monday**
- Hours `8`. Minutes `0`

**2. SharePoint → Get items**
- List Name: **Purchase Reviews**
- Filter Query: `ForwardToChairman eq 1 and ChairmanDecision eq 'Pending'`
- Order By: `ReqDepartment`
- Top Count: `500`

**3. Condition**
- `length(outputs('Get_items')?['body/value'])` **is greater than** `0`

**4. In True: Create HTML table**
- From: **value** (from *Get items*)
- Columns: **Custom**

| Header | Value (expression) |
|---|---|
| Department | `item()?['ReqDepartment']` |
| Item | `item()?['ReqItem']` |
| Total ¥ | `formatNumber(item()?['ReqTotal'],'N0')` |
| Principal | `item()?['PrincipalRecommendation']?['Value']` |
| Comment | `item()?['PrincipalComment']` |

**5. In True: Send an email (V2)**
- To: `mlee@zhongshischool.org`
- Subject: `Purchase requests awaiting your decision`
- Body (code view):
  ```html
  <p>Good morning,</p>
  <p>These purchase requests have been reviewed by the Principal and are waiting for your decision:</p>
  @{body('Create_HTML_table')}
  <p><a href="https://wzfs-ict.github.io/purchase-requests/">Open the report</a></p>
  ```

**Save**, then **Test → Manually**. You'll get an email once the Principal has forwarded at least one item.

---

## If something goes wrong
- **"Get items" error on Filter Query:** check the quotes. Text values need single quotes (`'Submitted'`), and the date expression must sit between `'` and `'`.
- **Empty table cells:** check the column name in the expression. Names are case-sensitive: `LineTotal`, `ReqTotal`, and so on.
- **The email shows `@{body(...)}` as plain text:** you pasted it outside code view. Delete it, insert **Create HTML table → Output** from dynamic content instead.

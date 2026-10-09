# Power Automate flows

The website is where people work. These two flows send the notifications:

| Flow | When | To | What |
|---|---|---|---|
| 1. Daily digest | Weekdays 15:30 Beijing | Principal (asumeg-ang@) | Items submitted since the last digest, as a table with the total |
| 2. Chairman reminder | Mondays 08:00 Beijing | Chairman (mlee@) | Forwarded items still **Pending**, as a table with the total |

**Why a digest and not an email per item?** A HoD submitting 12 items would otherwise send the Principal 12 emails.

**Before you start:** the SharePoint site and both lists must exist (README steps 1–4). The person who builds the flows needs **Full Control** on both lists, because the flows run as that person. Use the Principal's account or yours (as site owner).

Every SharePoint step below uses:
- **Site Address:** `https://weihaizhongshi.sharepoint.com/sites/PurchaseRequests`

---

## Flow 1: Daily digest to the Principal

**Create → Scheduled cloud flow.** Name: `Purchase Requests – daily digest`

1. **Recurrence**
   - Interval `1`, Frequency **Week**
   - Time zone **(UTC+08:00) Beijing, Chongqing, Hong Kong, Urumqi**
   - On these days: **Mon Tue Wed Thu Fri**. At these hours: `15`. At these minutes: `30`.

2. **Initialize variable**: Name `Since`, Type **String**, Value (expression). On Mondays it looks back over the weekend:
   ```
   formatDateTime(if(equals(dayOfWeek(utcNow()),1), addDays(utcNow(),-3), addDays(utcNow(),-1)), 'yyyy-MM-ddTHH:mm:ssZ')
   ```

3. **Initialize variable**: Name `Total`, Type **Float**, Value `0`

4. **SharePoint → Get items**
   - List Name: **Purchase Requests**
   - Filter Query: `RequestStatus eq 'Submitted' and SubmittedAt ge '@{variables('Since')}'`
   - Order By: `Department`
   - Top Count: `500`

5. **Condition**: expression `length(outputs('Get_items')?['body/value'])` **is greater than** `0`
   **If no:** leave empty (no email on quiet days).
   **If yes:** add steps 6–9.

6. **Apply to each** over `value` (from Get items) → **Increment variable** `Total` by expression `items('Apply_to_each')?['LineTotal']`

7. **Data Operation → Select**. From: `value` (Get items). Map (switch to text mode, key → expression):
   | Key | Value (expression) |
   |---|---|
   | Department | `item()?['Department']?['Value']` |
   | Item | `item()?['Title']` |
   | Qty | `item()?['Quantity']` |
   | Total (¥) | `formatNumber(item()?['LineTotal'], 'N0')` |
   | Priority | `item()?['Priority']?['Value']` |
   | Reason | `item()?['Reason']` |
   | Requested by | `item()?['Author']?['DisplayName']` |

8. **Data Operation → Create HTML table**. From: output of **Select**. Columns: Automatic.

9. **Office 365 Outlook → Send an email (V2)**
   - To: `asumeg-ang@zhongshischool.org`
   - Subject: `New purchase requests: @{length(outputs('Get_items')?['body/value'])} item(s), ¥@{formatNumber(variables('Total'),'N0')}`
   - Body (use the `</>` code view):
     ```html
     <p>The following purchase requests were submitted since the last digest.</p>
     @{body('Create_HTML_table')}
     <p><b>Total: ¥@{formatNumber(variables('Total'),'N0')}</b></p>
     <p><a href="https://wzfs-ict.github.io/purchase-requests/">Open Purchase Requests to review</a></p>
     ```

---

## Flow 2: Weekly reminder to the Chairman

**Create → Scheduled cloud flow.** Name: `Purchase Requests – Chairman reminder`

1. **Recurrence**: Interval `1`, Frequency **Week**, time zone Beijing, On these days **Monday**, hours `8`, minutes `0`.

2. **Initialize variable**: `Total`, **Float**, `0`
3. **Initialize variable**: `Rows`, **Array**, `[]`

4. **SharePoint → Get items**
   - List Name: **Purchase Reviews**
   - Filter Query: `ForwardToChairman eq 1 and ChairmanDecision eq 'Pending'`
   - Top Count: `500`

5. **Condition**: `length(outputs('Get_items')?['body/value'])` **is greater than** `0`. **If yes:**

6. **Apply to each** over `value` (from Get items):
   1. **SharePoint → Get item**. List Name **Purchase Requests**, Id (expression): `int(items('Apply_to_each')?['RequestId'])`
   2. **Increment variable** `Total` by `outputs('Get_item')?['body/LineTotal']`
   3. **Append to array variable** `Rows`, Value:
      ```json
      {
        "Department": "@{outputs('Get_item')?['body/Department/Value']}",
        "Item": "@{outputs('Get_item')?['body/Title']}",
        "Total (¥)": "@{formatNumber(outputs('Get_item')?['body/LineTotal'],'N0')}",
        "Principal": "@{items('Apply_to_each')?['PrincipalRecommendation']?['Value']}",
        "Comment": "@{items('Apply_to_each')?['PrincipalComment']}"
      }
      ```
   > If a HoD deletes a request after it was forwarded, **Get item** fails for that row, and the loop skips it. To make sure the email still goes out, open ⋯ → **Settings / Configure run after** on step 7 (**Create HTML table**) and tick both **is successful** and **has failed**.

7. **Create HTML table**: From `variables('Rows')`

8. **Send an email (V2)**
   - To: `mlee@zhongshischool.org`
   - Subject: `Purchase requests awaiting your decision: @{length(variables('Rows'))} item(s), ¥@{formatNumber(variables('Total'),'N0')}`
   - Body:
     ```html
     <p>Good morning. These requests have been reviewed by the Principal and are waiting for your decision.</p>
     @{body('Create_HTML_table')}
     <p><b>Total awaiting decision: ¥@{formatNumber(variables('Total'),'N0')}</b></p>
     <p><a href="https://wzfs-ict.github.io/purchase-requests/">Open the report</a></p>
     ```

---

## Testing
Open each flow and click **Test → Manually**. For Flow 1, submit a test item first. For Flow 2, the Principal must forward one first. Check the email arrives and the table looks right, then delete the test items.

## Optional extra (not built)
**Tell HoDs the decision:** trigger *When an item is created or modified* on **Purchase Reviews**. Use the condition `ChairmanDecision` is not `Pending`, then **Get item** from Purchase Requests and email `Author/Email`. Ask if you want this added.

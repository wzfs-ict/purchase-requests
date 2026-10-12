// ─────────────────────────────────────────────────────────────
//  WZFS Purchase Requests — settings
//  This is the ONLY file you normally need to edit.
//  Email addresses must be lower-case school accounts.
// ─────────────────────────────────────────────────────────────
window.APP_CONFIG = {
  schoolName: "Weihai Zhongshi Foreign School",

  // Microsoft Entra (Azure AD) app registration — see README step 2
  tenantId: "59aaa89c-ebfe-417a-bcdf-21065b509cf4",
  clientId: "84ebbd52-29fd-48fa-802c-5378884994b5",

  // The private SharePoint site that stores the data — see README step 1
  siteHostname: "weihaizhongshi.sharepoint.com",
  sitePath: "/sites/PurchaseRequests",

  // Optional: paste the IDs shown on the Setup tab after the lists are created.
  // Filling these in makes the page load faster for HoDs.
  siteId: "weihaizhongshi.sharepoint.com,3b2bbc14-1822-46d3-9e63-4eb8e7bb3072,dc8df276-ddfb-46e7-827c-d94e1302cbf9",
  requestsListId: "1f34f3e4-59fe-41a6-bd80-6fb8bec6a28f",

  requestsList: "Purchase Requests",
  reviewsList: "Purchase Reviews",
  settingsList: "Purchase Settings",   // people, departments, budget periods — edited on the Manage tab
  budgetsList: "Purchase Budgets",     // budget amounts per department — edited on the Manage tab

  // NOTE: once someone saves on the Manage tab, the people / departments / periods saved
  // there replace the ones below. The values below are only the starting point.

  // ── People ───────────────────────────────────────────────
  principals: [
    "asumeg-ang@zhongshischool.org",
  ],
  chairmen: [
    "mlee@zhongshischool.org",
  ],
  admins: [
    "glenj@zhongshischool.org",
  ],
  // Optional: fixes each HoD to their department so they can't pick another one.
  hods: {
    "breacher@zhongshischool.org": "Mathematics",   // Bijily Reacher (alias in staff list)
    "b_reacher@zhongshischool.org": "Mathematics",  // Bijily Reacher (actual account — keep last)
    "jpatole@zhongshischool.org": "Science",        // Jayesh Patole
    "mparker@zhongshischool.org": "Humanities",     // Mae Parker
    "xtobias@zhongshischool.org": "Primary",        // Xochitl Tobias, VP Primary
    "rrussell@zhongshischool.org": "Upper School",  // Roger Russell, VP Middle School
    "babuan@zhongshischool.org": "Curriculum",      // Beverly Abuan, Curriculum Head
    "mkkim@zhongshischool.org": "Communications",   // Andy Kim, VP Communications
    // "?@zhongshischool.org": "PE",                // PE HoD still to confirm
  },

  // Display names used in the admin "View as" menu.
  names: {
    "asumeg-ang@zhongshischool.org": "Arsenio Sumeg-ang",
    "mlee@zhongshischool.org": "Moody Lee",
    "b_reacher@zhongshischool.org": "Bijily Reacher",
    "breacher@zhongshischool.org": "Bijily Reacher",
    "jpatole@zhongshischool.org": "Jayesh Patole",
    "mparker@zhongshischool.org": "Mae Parker",
    "xtobias@zhongshischool.org": "Xochitl Tobias",
    "rrussell@zhongshischool.org": "Roger Russell",
    "mkkim@zhongshischool.org": "Andy Kim",
    "babuan@zhongshischool.org": "Beverly Abuan",
  },

  // ── Lists used in the form ───────────────────────────────
  // If you add a department here, also add it to the Department column choices in the SharePoint list.
  departments: ["PE", "Humanities", "Science", "Upper School", "Primary", "Mathematics", "Curriculum", "Communications"],
  academicYears: ["2026-27", "2027-28"],
  semesters: ["Fall", "Spring"],
  categories: ["Subscriptions", "Special Events", "Academic Materials", "Equipment", "Office Materials", "Other"],
  priorities: ["Essential", "Important", "Nice to have"],
  recommendations: ["Recommend", "Recommend with changes", "Not recommended", "Discuss"],
  decisions: ["Pending", "Approved", "Approved with changes", "Rejected", "Deferred"],
};

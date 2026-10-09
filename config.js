// ─────────────────────────────────────────────────────────────
//  WZFS Purchase Requests — settings
//  This is the ONLY file you normally need to edit.
//  Email addresses must be lower-case school accounts.
// ─────────────────────────────────────────────────────────────
window.APP_CONFIG = {
  schoolName: "Weihai Zhongshi Foreign School",

  // Microsoft Entra (Azure AD) app registration — see README step 2
  tenantId: "59aaa89c-ebfe-417a-bcdf-21065b509cf4",
  clientId: "PASTE-YOUR-APPLICATION-CLIENT-ID-HERE",

  // The private SharePoint site that stores the data — see README step 1
  siteHostname: "weihaizhongshi.sharepoint.com",
  sitePath: "/sites/PurchaseRequests",

  // Optional: paste the IDs shown on the Setup tab after the lists are created.
  // Filling these in makes the page load faster for HoDs.
  siteId: "",
  requestsListId: "",

  requestsList: "Purchase Requests",
  reviewsList: "Purchase Reviews",

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
    "breacher@zhongshischool.org": "Mathematics",   // Bijily Reacher
    "jpatole@zhongshischool.org": "Science",        // Jayesh Patole
    "mparker@zhongshischool.org": "Humanities",     // Mae Parker
    "xtobias@zhongshischool.org": "Primary",        // Xochitl Tobias, VP Primary
    "rrussell@zhongshischool.org": "Upper School",  // Roger Russell, VP Middle School
    // "?@zhongshischool.org": "PE",                // PE HoD still to confirm
  },

  // ── Lists used in the form ───────────────────────────────
  departments: ["PE", "Humanities", "Science", "Upper School", "Primary", "Mathematics"],
  academicYears: ["2026-27", "2027-28"],
  semesters: ["Fall", "Spring"],
  categories: ["Subscriptions", "Special Events", "Academic Materials", "Equipment", "Office Materials", "Other"],
  priorities: ["Essential", "Important", "Nice to have"],
  recommendations: ["Recommend", "Recommend with changes", "Not recommended", "Discuss"],
  decisions: ["Pending", "Approved", "Approved with changes", "Rejected", "Deferred"],
};

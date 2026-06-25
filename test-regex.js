const badgeUrl = "https://learn.microsoft.com/api/achievements/share/en-in/SiddhantChoudhary-6532/7DB7ATWZ?sharingId=EF92BA4F8DC67760";

let locale = 'en-us';
let username = null;
let achievementId = null;

let match = badgeUrl.match(/share\/([^\/]+)\/([^\/]+)\/([^\/\?]+)/);
if (match) {
  locale = match[1];
  username = match[2];
  achievementId = match[3];
} else {
    match = badgeUrl.match(/share\/([^\/]+)\/([^\/\?]+)/);
    if (match) {
        username = match[1];
        achievementId = match[2];
    } else {
        match = badgeUrl.match(/users\/([^\/]+)\/achievements\/([^\/\?]+)/);
        if (match) {
          username = match[1];
          achievementId = match[2];
        }
    }
}
console.log("username:", username);
console.log("achievementId:", achievementId);
console.log("locale:", locale);

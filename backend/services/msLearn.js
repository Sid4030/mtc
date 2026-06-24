export async function verifyMsLearnBadge(badgeUrl) {
  try {
    let username = null;
    let achievementId = null;
    let locale = 'en-us';
    let sharingId = null;

    // First, check if there's a sharingId in the URL and that it looks like a valid 16-char hex string
    const sharingIdMatch = badgeUrl.match(/sharingId=([A-Fa-f0-9]{16})(?:&|$)/);
    if (!sharingIdMatch) {
      return { success: false, error: 'Invalid or missing sharingId. Please provide the exact share URL.' };
    }
    sharingId = sharingIdMatch[1];

    // share URL format: https://learn.microsoft.com/en-us/users/username/achievements/share/en-us/username/achievementId
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

    if (!username || !achievementId) {
      return { success: false, error: 'Invalid MS Learn badge URL format.' };
    }

    const apiUrl = `https://learn.microsoft.com/api/achievements/${achievementId}?locale=${locale}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
        return { success: false, error: `Failed to fetch from MS Learn API. Status: ${response.status}` };
    }

    const data = await response.json();
    
    const title = data.title || (data.achievement && data.achievement.title);
    
    if (!title) {
         return { success: false, error: 'Could not find title in MS Learn API response.' };
    }

    return {
        success: true,
        title: title.trim(),
        username,
        achievementId
    };

  } catch (error) {
    console.error("Error in verifyMsLearnBadge:", error);
    return { success: false, error: error.message };
  }
}

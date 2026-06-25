import { verifyMsLearnBadge } from './backend/services/msLearn.js';

const run = async () => {
  const url1 = "https://learn.microsoft.com/en-in/users/SiddhantChoudhary-6532/achievements/7DB7ATWZ?sharingId=EF92BA4F8DC67760";
  const res1 = await verifyMsLearnBadge(url1);
  console.log("url1:", res1);
};

run();

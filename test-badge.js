import { verifyMsLearnBadge } from './backend/services/msLearn.js';

const run = async () => {
  const url = "https://learn.microsoft.com/api/achievements/share/en-in/SiddhantChoudhary-6532/7DB7ATWZ?sharingId=EF92BA4F8DC67760";
  const res = await verifyMsLearnBadge(url);
  console.log(res);
};

run();

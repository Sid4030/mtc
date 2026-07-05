import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true },
  moduleName: { type: String, required: true },
  expectedBadgeTitle: { type: String, required: true },
  moduleUrl: { type: String }
});

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  sessionName: { type: String, required: true },
  modules: [moduleSchema]
});

const Session = mongoose.models.Session || mongoose.model('Session', sessionSchema);

async function run() {
  if (!process.env.MONGO_URI) {
    console.error('No MONGO_URI in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const sessionData = {
    sessionId: 'session_6',
    sessionName: 'Session 6: RAG Apps',
    modules: [
      {
        moduleId: 's6_m1',
        moduleName: 'Create a knowledge mining solution with Azure AI Search',
        expectedBadgeTitle: 'Create a knowledge mining solution with Azure AI Search',
        moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/ai-knowldge-mining/?wt.mc_id=studentamb_458088'
      },
      {
        moduleId: 's6_m2',
        moduleName: 'Get started with AI-powered information extraction in Azure',
        expectedBadgeTitle: 'Get started with AI-powered information extraction in Azure',
        moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/get-started-information-extraction/?wt.mc_id=studentamb_458088'
      },
      {
        moduleId: 's6_m3',
        moduleName: 'Build knowledge-enhanced AI agents with Foundry IQ',
        expectedBadgeTitle: 'Build knowledge-enhanced AI agents with Foundry IQ',
        moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/introduction-foundry-iq/?wt.mc_id=studentamb_458088'
      }
    ]
  };

  try {
    const result = await Session.findOneAndUpdate(
      { sessionId: 'session_6' },
      sessionData,
      { upsert: true, new: true }
    );
    console.log('Session 6 updated successfully:', result);
  } catch (err) {
    console.error('Error updating session 6:', err);
  }

  mongoose.connection.close();
}

run();

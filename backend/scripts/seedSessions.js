import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Session from '../models/Session.js';

dotenv.config();

const seedSessions = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("No MONGO_URI provided in .env");
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        const sessionsData = [];
        
        // Session 1
        sessionsData.push({
            sessionId: 'session_1',
            sessionName: 'Session 1',
            modules: [
                {
                    moduleId: 's1_m1',
                    moduleName: 'Introduction to AI concepts',
                    expectedBadgeTitle: 'Introduction to AI concepts',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/?wt.mc_id=studentamb_496702'
                },
                {
                    moduleId: 's1_m2',
                    moduleName: 'Get started with AI in Azure',
                    expectedBadgeTitle: 'Get started with AI in Azure',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/get-started-with-ai-in-azure/?wt.mc_id=studentamb_496702'
                },
                {
                    moduleId: 's1_m3',
                    moduleName: 'Explore Generative AI',
                    expectedBadgeTitle: 'Explore generative AI',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/explore-generative-ai/?wt.mc_id=studentamb_496702'
                }
            ]
        });

        // Session 2
        sessionsData.push({
            sessionId: 'session_2',
            sessionName: 'Session 2',
            modules: [
                {
                    moduleId: 's2_m1',
                    moduleName: 'Use Azure AI Services for Language in a Microsoft Copilot Studio',
                    expectedBadgeTitle: 'Use Azure AI Services for Language in a Microsoft Copilot Studio',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/cognitive-service-power-virtual-agents/?wt.mc_id=studentamb_496702'
                },
                {
                    moduleId: 's2_m2',
                    moduleName: 'Analyze text with Azure Language in Foundry Tools',
                    expectedBadgeTitle: 'Analyze text with Azure Language in Foundry Tools',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/analyze-text-ai-language/?wt.mc_id=studentamb_496702'
                }
            ]
        });

        // Session 3
        sessionsData.push({
            sessionId: 'session_3',
            sessionName: 'Session 3',
            modules: [
                {
                    moduleId: 's3_m1',
                    moduleName: 'Get started with computer vision in Azure',
                    expectedBadgeTitle: 'Get started with computer vision in Azure',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/get-started-vision-azure/?wt.mc_id=studentamb_496702'
                },
                {
                    moduleId: 's3_m2',
                    moduleName: 'Introduction to computer vision concepts',
                    expectedBadgeTitle: 'Introduction to computer vision concepts',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/introduction-computer-vision/?wt.mc_id=studentamb_496702'
                },
                {
                    moduleId: 's3_m3',
                    moduleName: 'Introduction to Microsoft Foundry on Windows',
                    expectedBadgeTitle: 'Introduction to Microsoft Foundry on Windows',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/introduction-microsoft-foundry-windows/?wt.mc_id=studentamb_496702'
                }
            ]
        });

        // Session 4
        sessionsData.push({
            sessionId: 'session_4',
            sessionName: 'Session 4',
            modules: [
                {
                    moduleId: 's4_m1',
                    moduleName: 'Create speech-enabled apps with Azure Speech in Microsoft Foundry Tools',
                    expectedBadgeTitle: 'Create speech-enabled apps with Azure Speech in Microsoft Foundry Tools',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/create-speech-enabled-apps/?wt.mc_id=studentamb_458088'
                },
                {
                    moduleId: 's4_m2',
                    moduleName: 'Develop an Azure Speech Voice Live Agent in Microsoft Foundry.',
                    expectedBadgeTitle: 'Develop an Azure Speech Voice Live Agent in Microsoft Foundry.',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/develop-voice-live-agent/?wt.mc_id=studentamb_458088'
                },
                {
                    moduleId: 's4_m3',
                    moduleName: 'Translate text and speech with Microsoft Foundry Tools.',
                    expectedBadgeTitle: 'Translate text and speech with Microsoft Foundry Tools.',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/translate-text-speech/?wt.mc_id=studentamb_458088'
                }
            ]
        });

        // Session 5
        sessionsData.push({
            sessionId: 'session_5',
            sessionName: 'Session 5',
            modules: [
                {
                    moduleId: 's5_m1',
                    moduleName: 'Utilize an Azure OpenAI model to create an Agent',
                    expectedBadgeTitle: 'Utilize an Azure OpenAI model to create an Agent',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/utilize-azure-openai-model-create-app/?wt.mc_id=studentamb_458088'
                },
                {
                    moduleId: 's5_m2',
                    moduleName: 'Secure authentication and authorization for Azure OpenAI in Microsoft Foundry',
                    expectedBadgeTitle: 'Secure authentication and authorization for Azure OpenAI in Microsoft Foundry',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/secure-azure-openai-authentication-authorization/?wt.mc_id=studentamb_458088'
                },
                {
                    moduleId: 's5_m3',
                    moduleName: 'Explore identity in Microsoft Entra ID',
                    expectedBadgeTitle: 'Explore identity in Microsoft Entra ID.',
                    moduleUrl: 'https://learn.microsoft.com/en-us/training/modules/explore-identity-azure-active-directory/?wt.mc_id=studentamb_458088'
                }
            ]
        });

        // Placeholder for 6 to 7
        for (let i = 6; i <= 7; i++) {
            sessionsData.push({
                sessionId: `session_${i}`,
                sessionName: `Session ${i}`,
                modules: [
                    {
                        moduleId: `s${i}_m1`,
                        moduleName: `Module 1`,
                        expectedBadgeTitle: `Placeholder Title 1 for Session ${i}`
                    },
                    {
                        moduleId: `s${i}_m2`,
                        moduleName: `Module 2`,
                        expectedBadgeTitle: `Placeholder Title 2 for Session ${i}`
                    },
                    {
                        moduleId: `s${i}_m3`,
                        moduleName: `Module 3`,
                        expectedBadgeTitle: `Placeholder Title 3 for Session ${i}`
                    }
                ]
            });
        }

        // Session 8 (No modules, only project)
        sessionsData.push({
            sessionId: `session_8`,
            sessionName: `Session 8`,
            modules: []
        });

        // Clear existing to avoid unique constraint errors during testing
        await Session.deleteMany({});
        await Session.insertMany(sessionsData);
        
        console.log("8 Placeholder Sessions Seeded Successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Error seeding sessions:", err);
        process.exit(1);
    }
};

seedSessions();

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
                    moduleName: 'Describe cloud computing',
                    expectedBadgeTitle: 'Describe cloud computing'
                },
                {
                    moduleId: 's2_m2',
                    moduleName: 'Perform basic string formatting in C#',
                    expectedBadgeTitle: 'Perform basic string formatting in C#'
                },
                {
                    moduleId: 's2_m3',
                    moduleName: 'Store and retrieve data using literal and variable values in C#',
                    expectedBadgeTitle: 'Store and retrieve data using literal and variable values in C#'
                }
            ]
        });

        // Placeholder for 3 to 7
        for (let i = 3; i <= 7; i++) {
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

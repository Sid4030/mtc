import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const runMigration = async () => {
    try {
        console.log("Connecting to secondary DB...");
        const secondaryConn = mongoose.createConnection(process.env.SECONDARY_MONGO_URI);
        await new Promise((resolve) => secondaryConn.once('connected', resolve));
        
        console.log("Connecting to primary DB...");
        const primaryConn = mongoose.createConnection(process.env.MONGO_URI);
        await new Promise((resolve) => primaryConn.once('connected', resolve));

        const submissionSchema = new mongoose.Schema({}, { strict: false });
        
        const SecSub = secondaryConn.model('ProjectSubmission', submissionSchema, 'projectsubmissions');
        const PriSub = primaryConn.model('ProjectSubmission', submissionSchema, 'projectsubmissions');

        const secSubs = await SecSub.find({});
        console.log(`Found ${secSubs.length} submissions in secondary DB.`);

        let count = 0;
        for (const sub of secSubs) {
            const exists = await PriSub.findOne({ email: sub.email, sessionId: sub.sessionId });
            if (!exists) {
                await PriSub.create(sub.toObject());
                count++;
            }
        }
        console.log(`Migrated ${count} submissions to primary DB.`);

        const SecProg = secondaryConn.model('Progress', submissionSchema, 'progresses');
        const PriProg = primaryConn.model('Progress', submissionSchema, 'progresses');

        const secProgs = await SecProg.find({});
        console.log(`Found ${secProgs.length} progress records in secondary DB.`);
        let progCount = 0;
        for (const prog of secProgs) {
            const exists = await PriProg.findOne({ email: prog.email, sessionId: prog.sessionId, moduleId: prog.moduleId });
            if (!exists) {
                await PriProg.create(prog.toObject());
                progCount++;
            }
        }
        console.log(`Migrated ${progCount} progress records to primary DB.`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

runMigration();

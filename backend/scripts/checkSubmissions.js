import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    const primaryConn = mongoose.createConnection(process.env.MONGO_URI);
    await new Promise((resolve) => primaryConn.once('connected', resolve));
    const submissionSchema = new mongoose.Schema({}, { strict: false });
    const PriSub = primaryConn.model('ProjectSubmission', submissionSchema, 'projectsubmissions');
    const subs = await PriSub.find({});
    console.log("Submissions in primary DB:", subs);
    
    // Also check secondary just in case
    if (process.env.SECONDARY_MONGO_URI) {
        const secondaryConn = mongoose.createConnection(process.env.SECONDARY_MONGO_URI);
        await new Promise((resolve) => secondaryConn.once('connected', resolve));
        const SecSub = secondaryConn.model('ProjectSubmission', submissionSchema, 'projectsubmissions');
        const secSubs = await SecSub.find({});
        console.log("Submissions in secondary DB:", secSubs);
    }
    
    process.exit(0);
};
run();

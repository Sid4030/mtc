import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const SECONDARY_MONGO_URI = process.env.SECONDARY_MONGO_URI || process.env.MONGO_URI; 

let secondaryConnection = global.secondaryMongoose || null;

export const getSecondaryConnection = () => {
    if (secondaryConnection) {
        return secondaryConnection;
    }
    
    if (!SECONDARY_MONGO_URI) {
        console.warn("⚠️ Warning: SECONDARY_MONGO_URI and MONGO_URI are not defined. Secondary database cannot connect.");
        // Fallback to default mongoose connection object to prevent immediate crashes, though it will fail queries
        return mongoose.connection; 
    }

    secondaryConnection = mongoose.createConnection(SECONDARY_MONGO_URI);
    
    secondaryConnection.on('connected', () => {
        console.log('✅ Connected to Secondary MongoDB Atlas');
    });

    secondaryConnection.on('error', (err) => {
        console.error('❌ Secondary MongoDB connection error:', err);
    });

    global.secondaryMongoose = secondaryConnection;
    return secondaryConnection;
};

export default getSecondaryConnection;

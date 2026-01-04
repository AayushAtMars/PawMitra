import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Incident from './models/Incident.js';

dotenv.config();

// Connect to DB (mock connection not needed for schema check, but we need to load the model)
// Actually we can just check the schema paths directly
async function checkSchema() {
    console.log("Checking Incident Schema paths...");
    const paths = Incident.schema.paths;

    if (paths['aiAnalysis.suggestedProviders.name'] || paths['aiAnalysis.suggestedProviders']) {
        console.log("✅ 'aiAnalysis.suggestedProviders' found in schema!");
    } else {
        console.error("❌ 'aiAnalysis.suggestedProviders' NOT found in schema.");
        console.log("Available paths under aiAnalysis:", Object.keys(paths).filter(p => p.startsWith('aiAnalysis')));
    }
}

checkSchema();

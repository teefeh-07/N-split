// Chainhooks Client Setup
import { ChainhooksClient } from '@hirosystems/chainhooks-client';

export const chainhooksClient = new ChainhooksClient({
    url: 'http://localhost:20456', // Default Clarinet Chainhooks port
    apiKey: process.env.CHAINHOOKS_API_KEY || ''
});

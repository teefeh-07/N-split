# Chainhooks Integration

## Overview

Chainooks enables real-time blockchain event tracking for SereneHub.

## Setup

```bash
npm install @hirosystems/chainhooks-client
```

## Configuration

```typescript
import { ChainhooksClient } from "@hirosystems/chainhooks-client";

const client = new ChainhooksClient({
  url: "http://localhost:20456",
  apiKey: process.env.CHAINHOOKS_API_KEY
});
```

## Event Types

- Contract Calls
- Token Transfers
- NFT Events
- Staking Events

## Use Cases

1. Real-time transaction notifications
2. Indexing contract events
3. Building activity feeds
4. Automated responses to blockchain events


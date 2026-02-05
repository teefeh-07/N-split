# API Error Reference

## Error Format

All API errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

## Authentication Errors

| Code | Message | Resolution |
|------|---------|------------|
| AUTH_001 | Invalid wallet signature | Re-authenticate wallet |
| AUTH_002 | Session expired | Reconnect wallet |
| AUTH_003 | Forbidden | Check permissions |

## Transaction Errors

| Code | Message | Resolution |
|------|---------|------------|
| TX_001 | Insufficient balance | Add funds |
| TX_002 | Invalid parameters | Check inputs |
| TX_003 | Contract error | Check contract state |

## Network Errors

| Code | Message | Resolution |
|------|---------|------------|
| NET_001 | Connection timeout | Retry request |
| NET_002 | Service unavailable | Wait and retry |
| NET_003 | Rate limited | Slow down requests |


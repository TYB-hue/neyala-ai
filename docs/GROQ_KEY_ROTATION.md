# Groq API Key Rotation System

## Overview

The application now includes automatic API key rotation for Groq API keys. When the daily token limit is reached on one key, the system automatically switches to the next available backup key seamlessly.

## How It Works

1. **Key Manager**: A singleton `GroqKeyManager` class manages all API keys
2. **Automatic Detection**: When a "daily token limit" error is detected, the system automatically switches to the next available key
3. **Seamless Operation**: Users don't see any interruption - the request is automatically retried with the new key
4. **Fallback Chain**: If all keys are exhausted, a clear error message is shown

## Configuration

### Environment Variables

In your `.env.local` file:

```env
# Primary API key (required)
GROQ_API_KEY=your_primary_groq_api_key

# Backup keys (optional, comma-separated)
GROQ_API_KEY_BACKUP=backup_key_1,backup_key_2

# OR use individual backup key:
# GROQ_API_KEY_2=backup_key
```

### Backup Key Configuration

Backup keys are configured via the `GROQ_API_KEY_BACKUP` environment variable. The system will use these keys when the primary key reaches its daily token limit.

## Key Priority Order

1. `GROQ_API_KEY` (primary)
2. Keys from `GROQ_API_KEY_BACKUP` or `GROQ_API_KEY_2` (if set, in order they appear)

## Features

- ✅ Automatic key switching on token limit errors
- ✅ Tracks exhausted keys to avoid retrying them
- ✅ Seamless operation (no user-visible interruption)
- ✅ Clear error messages when all keys are exhausted
- ✅ Supports multiple backup keys
- ✅ Status monitoring via `getGroqKeyManager().getStatus()`

## Usage

The key rotation happens automatically - no code changes needed in your API routes. The `getGroqChatCompletion()` function handles everything transparently.

### Example Flow

```
1. Request comes in with primary key
2. Daily token limit reached → Key 1 marked as exhausted
3. System switches to backup key automatically
4. Request retried with backup key (seamlessly)
5. If backup also exhausted → switches to next key
6. If all keys exhausted → clear error message
```

## Monitoring

To check the status of your API keys:

```typescript
import { getGroqKeyManager } from '@/lib/groq-key-manager';

const status = getGroqKeyManager().getStatus();
console.log(status);
// {
//   totalKeys: 2,
//   exhaustedKeys: 1,
//   availableKeys: 1,
//   currentKeyIndex: 1
// }
```

## Reset Keys (for testing)

To reset exhausted keys (e.g., at the start of a new day):

```typescript
import { getGroqKeyManager } from '@/lib/groq-key-manager';

getGroqKeyManager().resetExhaustedKeys();
```

## Error Handling

- **Token Limit Errors**: Automatically switches keys and retries
- **Rate Limit Errors**: Uses exponential backoff with current key (doesn't switch)
- **Authentication Errors**: Throws immediately (doesn't switch - indicates invalid key)

## Notes

- Key switching only happens for daily token limit errors
- Rate limit errors (429) use the same key with exponential backoff
- All keys must be from the same provider (Groq) for this to work
- The system prevents infinite switching loops (max 10 switches per request)


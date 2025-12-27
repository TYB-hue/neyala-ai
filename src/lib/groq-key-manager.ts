import Groq from "groq-sdk";

/**
 * Manages multiple Groq API keys with automatic failover
 * Switches to backup keys when daily token limits are reached
 */
class GroqKeyManager {
  private keys: string[] = [];
  private currentKeyIndex: number = 0;
  private exhaustedKeys: Set<number> = new Set();
  private groqInstances: Map<string, Groq> = new Map();

  constructor() {
    // Primary key
    const primaryKey = process.env.GROQ_API_KEY;
    if (primaryKey) {
      this.keys.push(primaryKey);
    }

    // Backup keys from environment variable (comma-separated or single key)
    const backupKeysEnv = process.env.GROQ_API_KEY_BACKUP || process.env.GROQ_API_KEY_2;
    if (backupKeysEnv) {
      // Support comma-separated keys or single backup key
      const backupKeys = backupKeysEnv.split(',').map(k => k.trim()).filter(k => k);
      this.keys.push(...backupKeys);
    }

    // Validate we have at least one key
    if (this.keys.length === 0) {
      console.warn('No Groq API keys configured. Please set GROQ_API_KEY in .env.local');
    } else {
      console.log(`Groq Key Manager initialized with ${this.keys.length} API key(s)`);
    }

    // Pre-create Groq instances for all keys
    this.keys.forEach((key, index) => {
      this.groqInstances.set(key, new Groq({ apiKey: key }));
    });
  }

  /**
   * Get the current active Groq client
   */
  getCurrentClient(): Groq | null {
    if (this.keys.length === 0) {
      return null;
    }

    const currentKey = this.keys[this.currentKeyIndex];
    return this.groqInstances.get(currentKey) || null;
  }

  /**
   * Get the current API key (for debugging/logging)
   */
  getCurrentKey(): string | null {
    if (this.keys.length === 0) {
      return null;
    }
    return this.keys[this.currentKeyIndex];
  }

  /**
   * Mark current key as exhausted and switch to next available key
   * @returns true if a new key was switched to, false if all keys are exhausted
   */
  switchToNextKey(reason: string = 'Daily token limit reached'): boolean {
    // Mark current key as exhausted
    this.exhaustedKeys.add(this.currentKeyIndex);
    console.warn(`Key ${this.currentKeyIndex + 1} exhausted: ${reason}`);

    // Find next available key
    let attempts = 0;
    while (attempts < this.keys.length) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.keys.length;
      attempts++;

      if (!this.exhaustedKeys.has(this.currentKeyIndex)) {
        const newKey = this.keys[this.currentKeyIndex];
        console.log(`Switched to backup key ${this.currentKeyIndex + 1} (${newKey.substring(0, 10)}...)`);
        return true;
      }
    }

    // All keys exhausted
    console.error('All Groq API keys have been exhausted');
    return false;
  }

  /**
   * Check if all keys are exhausted
   */
  areAllKeysExhausted(): boolean {
    return this.exhaustedKeys.size >= this.keys.length;
  }

  /**
   * Get number of available (non-exhausted) keys
   */
  getAvailableKeyCount(): number {
    return this.keys.length - this.exhaustedKeys.size;
  }

  /**
   * Reset exhausted keys (useful for testing or daily reset)
   */
  resetExhaustedKeys(): void {
    this.exhaustedKeys.clear();
    this.currentKeyIndex = 0;
    console.log('All API keys reset - starting with primary key');
  }

  /**
   * Get status information
   */
  getStatus(): {
    totalKeys: number;
    exhaustedKeys: number;
    availableKeys: number;
    currentKeyIndex: number;
  } {
    return {
      totalKeys: this.keys.length,
      exhaustedKeys: this.exhaustedKeys.size,
      availableKeys: this.getAvailableKeyCount(),
      currentKeyIndex: this.currentKeyIndex,
    };
  }
}

// Singleton instance
let keyManagerInstance: GroqKeyManager | null = null;

/**
 * Get the singleton GroqKeyManager instance
 */
export function getGroqKeyManager(): GroqKeyManager {
  if (!keyManagerInstance) {
    keyManagerInstance = new GroqKeyManager();
  }
  return keyManagerInstance;
}

/**
 * Reset the key manager (useful for testing)
 */
export function resetGroqKeyManager(): void {
  keyManagerInstance = null;
}

export default getGroqKeyManager;


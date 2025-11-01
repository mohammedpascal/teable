import { Injectable } from '@nestjs/common';

/**
 * Simple in-memory store for OAuth state during social authentication flows.
 * Used by Passport strategies to store and verify state parameters for CSRF protection.
 */
@Injectable()
export class OauthStoreService {
  private stateMap = new Map<string, { state: string; expireAt: number }>();

  store(req: any, state: string, meta: any, callback: (err?: Error) => void): void {
    const key = req.sessionID || req.id || this.generateKey();
    const expireAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiration

    this.stateMap.set(key, { state, expireAt });
    this.cleanup();

    // Store the key in the request for later retrieval
    req._oauthStateKey = key;
    callback();
  }

  verify(req: any, state: string, callback: (err: Error | null, ok?: boolean, meta?: any) => void): void {
    const key = req._oauthStateKey || req.sessionID || req.id;
    
    if (!key) {
      return callback(new Error('No state key found in request'));
    }

    const stored = this.stateMap.get(key);
    
    if (!stored) {
      return callback(new Error('State not found'));
    }

    if (Date.now() > stored.expireAt) {
      this.stateMap.delete(key);
      return callback(new Error('State expired'));
    }

    if (stored.state !== state) {
      return callback(new Error('State mismatch'));
    }

    this.stateMap.delete(key);
    callback(null, true);
  }

  private generateKey(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.stateMap.entries()) {
      if (now > value.expireAt) {
        this.stateMap.delete(key);
      }
    }
  }
}


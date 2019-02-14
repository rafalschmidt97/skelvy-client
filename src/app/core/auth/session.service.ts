import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  static readonly SESSION_STORAGE_KEY = 'token';

  constructor(private readonly storage: Storage) {}

  async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return session !== null;
  }

  getSession(): Promise<string> {
    return this.storage.get(SessionService.SESSION_STORAGE_KEY);
  }

  async createSession(token: string) {
    await this.storage.set(SessionService.SESSION_STORAGE_KEY, token);
  }

  async removeSession() {
    await this.storage.remove(SessionService.SESSION_STORAGE_KEY);
  }
}

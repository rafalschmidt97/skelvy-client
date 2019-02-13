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

  createSession(token: string) {
    this.storage.set(SessionService.SESSION_STORAGE_KEY, token);
  }

  removeSession() {
    this.storage.remove(SessionService.SESSION_STORAGE_KEY);
  }
}

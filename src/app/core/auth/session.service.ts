import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { TokenDto } from './auth';

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

  getSession(): Promise<TokenDto> {
    return this.storage.get(SessionService.SESSION_STORAGE_KEY);
  }

  async createSession(token: TokenDto) {
    await this.storage.set(SessionService.SESSION_STORAGE_KEY, token);
  }

  async removeSession() {
    await this.storage.remove(SessionService.SESSION_STORAGE_KEY);
  }
}

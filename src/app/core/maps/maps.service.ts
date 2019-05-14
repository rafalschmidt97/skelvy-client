import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MapsResponse } from './maps';

@Injectable({
  providedIn: 'root',
})
export class MapsService {
  constructor(private readonly http: HttpClient) {}

  search(search: string, language: string): Observable<MapsResponse[]> {
    return this.http.get<MapsResponse[]>(
      `${
        environment.versionApiUrl
      }maps/search?search=${search}&language=${language}`,
    );
  }

  reverse(
    latitude: number,
    longitude: number,
    language: string,
  ): Observable<MapsResponse[]> {
    return this.http.get<MapsResponse[]>(
      `${
        environment.versionApiUrl
      }maps/reverse?latitude=${latitude}&longitude=${longitude}&language=${language}`,
    );
  }
}

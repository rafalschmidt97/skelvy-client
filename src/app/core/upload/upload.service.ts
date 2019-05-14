import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private readonly http: HttpClient) {}

  upload(file: FormData): Observable<any> {
    return this.http.post<string>(environment.versionApiUrl + 'uploads', file);
  }
}

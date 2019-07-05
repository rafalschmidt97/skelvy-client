import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PhotoDto } from './upload';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private readonly http: HttpClient) {}

  upload(file: FormData): Observable<PhotoDto> {
    return this.http.post<PhotoDto>(
      environment.versionApiUrl + 'uploads',
      file,
    );
  }
}

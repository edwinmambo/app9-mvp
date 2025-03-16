import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly API_URL = `${environment.apiUrl}/content`;
  
  constructor(private http: HttpClient) {}
  
  getRecommendedContent(): Observable<any> {
    return this.http.get(`${this.API_URL}/recommended`)
      .pipe(
        catchError(error => {
          return throwError(() => error.error || { message: 'Failed to get recommended content' });
        })
      );
  }
  
  getFeaturedContent(): Observable<any> {
    return this.http.get(`${this.API_URL}/featured`)
      .pipe(
        catchError(error => {
          return throwError(() => error.error || { message: 'Failed to get featured content' });
        })
      );
  }
  
  getContentById(id: string): Observable<any> {
    return this.http.get(`${this.API_URL}/${id}`)
      .pipe(
        catchError(error => {
          return throwError(() => error.error || { message: 'Failed to get content' });
        })
      );
  }
  
  searchContent(query: string, filters: any = {}): Observable<any> {
    return this.http.post(`${this.API_URL}/search`, { query, filters })
      .pipe(
        catchError(error => {
          return throwError(() => error.error || { message: 'Failed to search content' });
        })
      );
  }
  
  saveContent(contentId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/save`, { contentId })
      .pipe(
        catchError(error => {
          return throwError(() => error.error || { message: 'Failed to save content' });
        })
      );
  }
  
  unsaveContent(contentId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/save/${contentId}`)
      .pipe(
        catchError(error => {
          return throwError(() => error.error || { message: 'Failed to unsave content' });
        })
      );
  }
}
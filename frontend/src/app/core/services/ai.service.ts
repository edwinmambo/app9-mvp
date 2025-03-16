import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly API_URL = `${environment.aiApiUrl}`;
  
  constructor(private http: HttpClient) {}
  
  getChatResponse(message: string, chatHistory: any[] = []): Observable<any> {
    return this.http.post(`${this.API_URL}/chat`, { message, chat_history: chatHistory })
      .pipe(
        catchError(error => {
          return throwError(() => error.error || { message: 'Failed to get chat response' });
        })
      );
  }
  
  getDailyContent(): Observable<any> {
    return this.http.get(`${this.API_URL}/daily-content`)
      .pipe(
        catchError(error => {
          return throwError(() => error.error || { message: 'Failed to get daily content' });
        })
      );
  }
  
  getPrediction(inputText: string, parameters: any = {}): Observable<any> {
    return this.http.post(`${this.API_URL}/predict`, { input_text: inputText, parameters })
      .pipe(
        catchError(error => {
          return throwError(() => error.error || { message: 'Failed to get prediction' });
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
}
import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AiService } from './ai.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly API_URL = `${environment.apiUrl}/chat`;
  
  constructor(private aiService: AiService, private http: HttpClient) {}

  /**
   * Gets a response from the AI based on the user's message and chat history
   * @param message The user's message
   * @param chatHistory Previous chat messages
   * @returns Observable with the AI's response
   */
  getChatResponse(
    message: string,
    chatHistory: any[] = []
  ): Observable<string> {
    return this.aiService.getChatResponse(message, chatHistory)
      .pipe(
        map(response => {
          // Handle different response formats
          // If response is an object with a 'response' property, use that
          // If response is already a string, use it directly
          if (response && typeof response === 'object' && 'response' in response) {
            return response.response;
          } else if (typeof response === 'string') {
            return response;
          } else {
            console.warn('Unexpected response format:', response);
            return String(response);
          }
        }),
        catchError(error => {
          console.error('Chat error:', error);
          return throwError(() => new Error('Failed to get chat response. Please try again.'));
        })
      );
  }

  /**
   * Saves the chat history to the user's account
   * @param chatHistory The chat history to save
   * @returns Observable with the save result
   */
  saveChatHistory(chatHistory: any[]): Observable<any> {
    return this.http.post(`${this.API_URL}/history`, { chatHistory })
      .pipe(
        catchError(error => {
          console.error('Error saving chat history:', error);
          return throwError(() => new Error('Failed to save chat history. Please try again.'));
        })
      );
  }
}

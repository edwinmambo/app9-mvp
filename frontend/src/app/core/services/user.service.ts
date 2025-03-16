import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Gets the current user's profile information
   * @returns Observable with user data
   */
  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.API_URL}/me`).pipe(
      catchError((error) => {
        return throwError(
          () => error.error || { message: 'Failed to get user profile' }
        );
      })
    );
  }

  /**
   * Gets the user's recent activity
   * @returns Observable with activity data
   */
  getUserActivity(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/activity`).pipe(
      catchError((error) => {
        return throwError(
          () => error.error || { message: 'Failed to get user activity' }
        );
      })
    );
  }

  /**
   * Gets the user's saved content
   * @returns Observable with saved content data
   */
  getSavedContent(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/saved-content`).pipe(
      catchError((error) => {
        return throwError(
          () => error.error || { message: 'Failed to get saved content' }
        );
      })
    );
  }

  /**
   * Updates the user's profile information
   * @param userData Updated user data
   * @returns Observable with updated user data
   */
  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${this.API_URL}/me`, userData).pipe(
      catchError((error) => {
        return throwError(
          () => error.error || { message: 'Failed to update profile' }
        );
      })
    );
  }

  /**
   * Saves a content item to the user's saved content
   * @param contentId ID of the content to save
   * @returns Observable with save result
   */
  saveContent(contentId: string): Observable<any> {
    return this.http.post(`${this.API_URL}/saved-content`, { contentId }).pipe(
      catchError((error) => {
        return throwError(
          () => error.error || { message: 'Failed to save content' }
        );
      })
    );
  }

  /**
   * Removes a content item from the user's saved content
   * @param contentId ID of the content to remove
   * @returns Observable with remove result
   */
  removeSavedContent(contentId: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/saved-content/${contentId}`).pipe(
      catchError((error) => {
        return throwError(
          () => error.error || { message: 'Failed to remove saved content' }
        );
      })
    );
  }
}

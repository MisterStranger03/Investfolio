import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth'; 

interface ApiResponse { success: boolean; data: any; error?: string; }
export interface Profile { name: string; defaultCurrency: string; imageUrl: string; }

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private apiUrl = '{backend_url}/api';
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  public currentUserProfile = signal<Profile | null>(null);

  getProfile(): Observable<ApiResponse> {
    const userUID = this.authService.getCurrentUserUID();
    if (!userUID) {
      return of({ success: true, data: null });
    }
    
    return this.http.get<ApiResponse>(`${this.apiUrl}/profile?userId=${userUID}`).pipe(
      tap(res => {
        if (res.success) {
          this.currentUserProfile.set(res.data);
        }
      })
    );
  }

  fetchUserProfile(): void {
    this.getProfile().subscribe();
  }

  saveProfile(profileData: Partial<Profile>): Observable<ApiResponse> {
    const userUID = this.authService.getCurrentUserUID();
    if (!userUID) return of({ success: false, data: null, error: "User not authenticated" });

    const payload = { ...profileData, user: userUID };
    return this.http.post<ApiResponse>(`${this.apiUrl}/profile`, payload).pipe(
      tap(res => {
        if (res.success) {
          this.currentUserProfile.set(res.data);
        }
      })
    );
  }
  
  getCloudinarySignature(): Observable<{success: boolean, signature: string, timestamp: number}> {
    return this.http.post<{success: boolean, signature: string, timestamp: number}>(`${this.apiUrl}/cloudinary-signature`, {});
  }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../env/environment';
import { AuthContextService } from './auth-context.service';

export interface User {
  id: number;
  name: string;
  role: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: any;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private authCtx = inject(AuthContextService);
  private apiUrl = `${environment.baseUrl}api/user`;

  private get headers() {
    return new HttpHeaders({ 'x-user-id': this.authCtx.userId().toString() });
  }

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.apiUrl, { headers: this.headers });
  }

  createUser(name: string, role: string): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(this.apiUrl, { name, role }, { headers: this.headers });
  }

  updateUserRole(id: number, role: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.apiUrl}/${id}/role`, { role }, { headers: this.headers });
  }

  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, { headers: this.headers });
  }
}

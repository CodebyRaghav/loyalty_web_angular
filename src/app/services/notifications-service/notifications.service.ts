import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  accessToken: any =  localStorage.getItem('access_token');
  username : any = localStorage.getItem('username');
constructor(private http: HttpClient) {
    // this.apiUrl = environment.apiBaseUrl;
  }
  CreateNotification(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123',
    });
  
    return this.http.post<any>('http://loyaltyApi/index.php/api/Template', data, {headers});
  }

  GetNotificationList(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123'
    });
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/Template', {headers});
  }

  GetTemplateTypesList(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123'
    });
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/Template/getTemplateType', {headers});
  }

  UpdateNotification(id:number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123'
      // 'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(`http://loyaltyApi/index.php/api/Template/${id}`, data, {headers});
  }
}
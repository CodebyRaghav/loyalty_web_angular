import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../loader-service/loader.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  accessToken: any =  localStorage.getItem('access_token');
  username : any = localStorage.getItem('username');
constructor(private http: HttpClient, private loaderService: LoaderService) {
    // this.apiUrl = environment.apiBaseUrl;
  }
  CreateNotification(data: any): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123',
    });
  
    return this.http.post<any>('http://loyaltyApi/index.php/api/Template', data, {headers});
  }

  GetNotificationList(): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123'
    });
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/Template', {headers});
  }

  GetTemplateTypesList(): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123'
    });
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/Template/getTemplateType', {headers});
  }

  UpdateNotification(id:number, data: any): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123'
      // 'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(`http://loyaltyApi/index.php/api/Template/${id}`, data, {headers});
  }
}
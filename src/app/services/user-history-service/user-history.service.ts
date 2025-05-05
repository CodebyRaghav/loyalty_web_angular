import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../loader-service/loader.service';

@Injectable({
  providedIn: 'root'
})
export class UserHistoryService {
  accessToken: any =  localStorage.getItem('access_token');
constructor(private http: HttpClient, private loaderService: LoaderService) {  }

  GetUsersHistory(data: any): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123'
    });

    let params = new HttpParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== '') {
        params = params.set(key, data[key]);
      }
    });
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/LoyaltyHistory/transactions/', {
    params: params,
    headers: headers});
  }


  GetAnalytics(data: any): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123'
    });

    let params = new HttpParams();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== '') {
        params = params.set(key, data[key]);
      }
    });
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/LoyaltyHistory/analytics', {
      params: params,
      headers: headers});
  }

  

  UpdateExpiry(id:number, data: any): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.accessToken}`,
      'my_key': 'abc123'
      // 'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(`http://loyaltyApi/index.php/api/LoyaltyHistory/${id}`, data, {headers});
  }
}
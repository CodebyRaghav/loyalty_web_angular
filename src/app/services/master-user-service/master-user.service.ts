import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../loader-service/loader.service';

@Injectable({
  providedIn: 'root'
})
export class MasterUserService {
  accessToken: any =  localStorage.getItem('access_token');
constructor(private http: HttpClient, private loaderService: LoaderService) {  }

  GetUserList(data: any): Observable<any> {
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
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/UserLoyaltyStatus', {
    params: params,
    headers: headers});
  }


  GetTiersList(): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'my_key': 'abc123',
      'Authorization': `Bearer ${this.accessToken}`
    })
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/UserLoyaltyStatus/getTierNameList', {headers});
  }


  UpdateUserInfo(data: any): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'my_key': 'abc123',
      'Authorization': `Bearer ${this.accessToken}`
      // 'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(`http://loyaltyApi/index.php/api/Template/`, data, {headers});
  }
}
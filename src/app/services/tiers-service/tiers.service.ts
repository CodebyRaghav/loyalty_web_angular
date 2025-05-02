import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../loader-service/loader.service';

@Injectable({
  providedIn: 'root'
})
export class TiersService {
  accessToken: any =  localStorage.getItem('access_token');
  username : any = localStorage.getItem('username');
constructor(private http: HttpClient, private loaderService: LoaderService) {
    // this.apiUrl = environment.apiBaseUrl;
  }
  CreateTier(data: any): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'my_key': 'abc123',
      'Authorization': `Bearer ${this.accessToken}`,
    });
  
    return this.http.post<any>('http://loyaltyApi/index.php/api/Tier/createTier', data, {headers});
  }

  GetTierList(): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'my_key': 'abc123',
      'Authorization': `Bearer ${this.accessToken}`
    });
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/Tier/getTierList', {headers});
  }

  UpdateTier(id:number, data: any): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'my_key': 'abc123',
      'Authorization': `Bearer ${this.accessToken}`
      // 'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(`http://loyaltyApi/index.php/api/Tier/updateTier/${id}`, data, {headers});
  }
}

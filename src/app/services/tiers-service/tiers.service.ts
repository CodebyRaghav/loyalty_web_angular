import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TiersService {
constructor(private http: HttpClient) {
    // this.apiUrl = environment.apiBaseUrl;
  }
  CreateTier(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'my_key': 'abc123',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDU0ODgzNjUsImV4cCI6MTc0NjM1MjM2NSwiZGF0YSI6eyJpZCI6IjIwNDgiLCJlbWFpbCI6ImZyYWNAZ21haWwuY29tIn19.GXoojpCggewXU-eVs016YmdjHKvYscmuXD6hdRajnRk'
    });
  
    return this.http.post<any>('http://loyaltyApi/index.php/api/Tier/createTier', data, {headers});
  }

  GetTierList(): Observable<any> {
    const headers = new HttpHeaders({
      'my_key': 'abc123',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDU0ODgzNjUsImV4cCI6MTc0NjM1MjM2NSwiZGF0YSI6eyJpZCI6IjIwNDgiLCJlbWFpbCI6ImZyYWNAZ21haWwuY29tIn19.GXoojpCggewXU-eVs016YmdjHKvYscmuXD6hdRajnRk'
    });
  
    return this.http.get<any>('http://loyaltyApi/index.php/api/Tier/getTierList', {headers});
  }

  UpdateTier(id:number, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'my_key': 'abc123',
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3NDU0ODgzNjUsImV4cCI6MTc0NjM1MjM2NSwiZGF0YSI6eyJpZCI6IjIwNDgiLCJlbWFpbCI6ImZyYWNAZ21haWwuY29tIn19.GXoojpCggewXU-eVs016YmdjHKvYscmuXD6hdRajnRk'
      // 'Content-Type': 'application/json'
    });
  
    return this.http.put<any>(`http://loyaltyApi/index.php/api/Tier/updateTier/${id}`, data, {headers});
  }
}

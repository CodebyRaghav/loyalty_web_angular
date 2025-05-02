import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from '../loader-service/loader.service';
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl: string;
  constructor(private http: HttpClient, private loaderService: LoaderService) {
    // this.apiUrl = environment.apiBaseUrl;
  }
  AuthenticateUser(data: any): Observable<any> {
    this.loaderService.show();
    const headers = new HttpHeaders({
      'my_key': 'abc123'
    });
  
    return this.http.post<any>('http://loyaltyapi/index.php/api/user/login', data, {headers});
  }
}

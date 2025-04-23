// angular import
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  constructor(private navRoute: Router) {
    localStorage.removeItem('access_token');
    // if (localStorage.getItem('access_token')) {
    //   this.navRoute.navigate(['/default']);
    // }
  }
  onSubmitButton() {
    const accessToken = 'your_access_token';
    localStorage.setItem('access_token', accessToken);
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      console.log('Stored Token: ', storedToken);
      this.navRoute.navigate(['/default']);
    }
    // localStorage.removeItem('access_token');
  }
}

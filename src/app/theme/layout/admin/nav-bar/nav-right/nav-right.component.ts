// Angular import
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

// third party import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-nav-right',
  imports: [RouterModule, SharedModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  username = localStorage.getItem('username') ? localStorage.getItem('username') : localStorage.getItem('hcode');

  constructor(private router: Router) {}

  onLogoutButton() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('hcode');
    this.router.navigate(['/login']);
  }
}

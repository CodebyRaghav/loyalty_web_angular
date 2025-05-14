import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { LoginService } from 'src/app/services/login-service/login.service';

@Component({
  selector: 'app-prelogin',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, ToastrModule],
  templateUrl: './prelogin.component.html',
  styleUrls: ['./prelogin.component.scss']
})
export default class PreLoginComponent implements OnInit {
  preloginForm: FormGroup;
  invalidUser: boolean = false;

  constructor(
    private navRoute: Router,
    private fb: FormBuilder,
    private loginSvc: LoginService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute
  ) {
    this.preloginForm = this.fb.group({
      user_hcode: ['', Validators.required]
    });
  }

  // ngOnInit(): void {
  //   const uidFromUrl = this.route.snapshot.queryParamMap.get('UID');

  //   if (uidFromUrl) {
  //     this.preloginForm.patchValue({ user_hcode: uidFromUrl });

  //     this.loginSvc.AuthenticateUser({ user_hcode: uidFromUrl }).subscribe({
  //       next: (resp) => {
  //         console.log('resp', resp);
  //         this.loaderService.hide();

  //         if (resp.status) {
  //           const accessToken = resp.token;
  //           const role = resp.role;
  //           localStorage.setItem('access_token', accessToken);
  //           localStorage.setItem('hcode', uidFromUrl);
  //           localStorage.setItem('role', role);
  //           this.toastr.success('User Logged In Successfully!', 'Success');
  //           this.navRoute.navigate(['/dashboard']);
  //         } else {
  //           this.toastr.error(resp.message, 'Error');
  //         }
  //       },
  //       error: (err) => {
  //         this.loaderService.hide();
  //         this.toastr.error(err.error.message || 'Login failed', 'Error');
  //       }
  //     });
  //   }

  //   if (localStorage.getItem('access_token')) {
  //     this.toastr.success('User is already Logged In!', 'Success');
  //     this.navRoute.navigate(['/dashboard']);
  //   }
  // }

  // onSubmitButton() {
  //   debugger;
  //   this.preloginForm.markAllAsTouched();

  //   if (this.preloginForm.valid) {
  //     let formVal = this.preloginForm.value;

  //     this.loginSvc.AuthenticateUser(formVal).subscribe({
  //       next: (resp) => {
  //         this.loaderService.hide();
  //         console.log('Login response (URL-based):', resp);

  //         if (resp.status) {
  //           const accessToken = resp.token;
  //           const role = resp.role;
  //           localStorage.setItem('access_token', accessToken);
  //           localStorage.setItem('hcode', formVal.user_hcode);
  //           localStorage.setItem('role', role);
  //           this.toastr.success('User Logged In Successfully!', 'Success');
  //           this.navRoute.navigate(['/dashboard']);
  //         } else {
  //           this.toastr.error(resp.message, 'Error');
  //         }
  //         // console.log('resp', resp);
  //       },
  //       error: (err) => {
  //         this.loaderService.hide();
  //         console.error('Login error (URL-based):', err);
  //         this.toastr.error(err.error.message || 'Login failed', 'Error');
  //       }
  //     });
  //   }
  // }
  ngOnInit(): void {
    const hcodeFromUrl = this.route.snapshot.paramMap.get('user_hcode');

    if (hcodeFromUrl) {
      this.preloginForm.patchValue({ user_hcode: hcodeFromUrl });

      this.loginSvc.AuthenticateUser({ user_hcode: hcodeFromUrl }).subscribe({
        next: (resp) => {
          console.log('Login response:', resp);

          if (resp.status) {
            const accessToken = resp.token;
            const role = resp.role;

            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('hcode', hcodeFromUrl);
            localStorage.setItem('role', role);

            if (localStorage.getItem('role')) {
              this.loaderService.hide();
              this.toastr.success('User Logged In Successfully!', 'Success');
              this.navRoute.navigate(['/dashboard']);
            }
          } else {
            this.invalidUser = true;
            this.toastr.error(resp.message, 'Error');
          }
        },
        error: (err) => {
          this.loaderService.hide();
          this.invalidUser = true;
          this.toastr.error(err.error.message || 'Login failed', 'Error');
        }
      });
    }

    if (localStorage.getItem('access_token')) {
      this.toastr.success('User is already Logged In!', 'Success');
      this.navRoute.navigate(['/dashboard']);
    }
  }
}

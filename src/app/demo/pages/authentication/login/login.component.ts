import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoaderService } from 'src/app/services/loader-service/loader.service';
import { LoginService } from 'src/app/services/login-service/login.service';
@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, ToastrModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  loginForm: FormGroup;
  constructor(private navRoute: Router, private fb: FormBuilder
    , private loginSvc: LoginService, private toastr: ToastrService, private loaderService: LoaderService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (localStorage.getItem('access_token')) {
      this.toastr.success('User is already Logged In!', 'Success');
      this.navRoute.navigate(['/dashboard']);
    }
  }
  onSubmitButton() {
    this.loginForm.markAllAsTouched();
    if(this.loginForm.valid){
      let formVal = this.loginForm.value;
      this.loginSvc.AuthenticateUser(formVal).subscribe({
        next: (resp)=>{
          this.loaderService.hide();
          if(resp.status){
            const accessToken = resp.token;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('username', formVal.username);
            this.toastr.success('User Logged In Successfully!', 'Success');
            this.navRoute.navigate(['/dashboard']);
          }else{
            this.toastr.error(resp.message, 'Error');
          }
        },
        error: (err)=>{
          this.loaderService.hide();
          this.toastr.error(err.error.message, 'Error');
        }
      })
    }
  }
}

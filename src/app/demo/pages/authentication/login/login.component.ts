import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login-service/login.service';
import { buildFormData } from 'src/app/utilities/FnUtilities';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule, ToastrModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  loginForm: FormGroup;
  constructor(private navRoute: Router, private fb: FormBuilder
    , private loginSvc: LoginService, private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (localStorage.getItem('access_token')) {
      this.toastr.success('User is already Logged In!', 'Success');
      this.navRoute.navigate(['/default']);
    }
  }
  onSubmitButton() {
    this.loginForm.markAllAsTouched();
    if(this.loginForm.valid){
      let formVal = this.loginForm.value;
      let formData = new FormData();
      buildFormData(formData, formVal);
      this.loginSvc.AuthenticateUser(formData).subscribe({
        next: (resp)=>{
          if(resp.status){
            this.toastr.success('User Signed In Successfully!', 'Success');
            const accessToken = resp.token;
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('username', formVal.username);
            this.navRoute.navigate(['/default']);
          }else{
            this.toastr.error(resp.message, 'Error');
          }
        }
      })
    }
  }
}

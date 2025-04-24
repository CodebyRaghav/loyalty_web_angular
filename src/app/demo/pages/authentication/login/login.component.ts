// angular import
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from 'src/app/services/login-service/login.service';
// import { LoginService } from 'src/app/services/login service/login.service';
import { buildFormData } from 'src/app/utilities/FnUtilities';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  loginForm: FormGroup;
  constructor(private navRoute: Router, private fb: FormBuilder
    , private loginSvc: LoginService
  ) {
    localStorage.removeItem('access_token');
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // if (localStorage.getItem('access_token')) {
    //   this.navRoute.navigate(['/default']);
    // }
  }
  onSubmitButton() {
    this.loginForm.markAllAsTouched();
    if(this.loginForm.valid){
      let formVal = this.loginForm.value;
      let formData = new FormData();
      buildFormData(formData, formVal);
      this.loginSvc.AuthenticateUser(formData).subscribe({
        next: (resp)=>{
          console.log("response: ", resp);
        }
      })
      // const accessToken = 'your_access_token';
      // localStorage.setItem('access_token', accessToken);
      // const storedToken = localStorage.getItem('access_token');
      // if (storedToken) {
      //   console.log('Stored Token: ', storedToken);
      //   this.navRoute.navigate(['/default']);
      // }
    }
    // localStorage.removeItem('access_token');
  }

//   onSubmitButton(){
//     const myHeaders = new Headers();
// myHeaders.append("my_key", "abc123");
// myHeaders.append("Content-Type", "application/json");

// const raw = JSON.stringify({
//   "username": "FRACMASTER",
//   "password": "Infotech@arc"
// });

// const requestOptions:any  = {
//   method: "POST",
//   headers: myHeaders,
//   body: raw,
//   //redirect: "follow"
// };

// fetch("http://loyaltyapi/index.php/api/user/login", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.error(error));
//   }
}

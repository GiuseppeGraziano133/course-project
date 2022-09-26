import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, LogResponseData, RegResponseData } from './auth.service';
import { User } from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  isLogging: boolean = true;
  isLoading: boolean = false;
  error: {code: string, message: string} = null;

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    let email = localStorage.getItem('email');
    let password = localStorage.getItem('password');

    if (email != 'undefined' && email != 'null' && email != '' && password != 'undefined' && password != 'null' && password != '') {
      this.onSubmit(email, password);
    }
  }

  onSwitchMode() {
    this.isLogging = !this.isLogging;
  }

  onSubmit(email: string, password: string) {
    this.error = null;

    let authObs: Observable<RegResponseData | LogResponseData>;

    this.isLoading = true;

    if (this.isLogging) {
      authObs = this.auth.login({email, password});
    } else {
      authObs = this.auth.register({email, password})
    }

    authObs.subscribe(res => {
      this.isLoading = false;

      localStorage.setItem('email', email);
      localStorage.setItem('password', password);

      this.router.navigate(['/recipes']);
    }, error => {
      this.error = {code: error.code, message: error.message};
      this.isLoading = false;
    })
  }
}

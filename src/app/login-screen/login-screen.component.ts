import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services/AuthenticationService';

@Component({
  selector: 'Login',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.sass']
})
export class LoginScreenComponent implements OnInit {

  @Input() username?: string;
  @Input() password?: string;
  authenticated: boolean = false;
  user: any = null;

  constructor(
    private readonly auth: AuthenticationService) { }
  
  tryLogin(): void {
    if (this.username && this.password) { 
      this.auth.tryLogin(this.username, this.password, (user: any) => { 
        this.authenticated = true;
        this.user = user;
      })
    } 
  }

  ngOnInit(): void {

  } 
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LoggerService } from '../logger/logger.service';

interface User { 
    username: string;
}

interface JWTToken { 
    token: string,
    refresh: string
  }

@Injectable()
export class AuthenticationService {

    private user?: User;
    private authenticated : boolean = false;
    private tokenData: JWTToken = {token: '', refresh: ''}
    private error: any = {}

    constructor(
        private logger: LoggerService,     
        private readonly http: HttpClient, 
        private readonly jwt: JwtHelperService
        ) 
    {
    }  

    getAuthenticatedHeaders() { 
        return {
            Authorization: `Bearer ${this.tokenData.token}`
        }
    }

    onAuthenticationSucceeded(tokenData: JWTToken) { 
        this.authenticated = true;
        this.tokenData =  {...tokenData };
        const user = this.jwt.decodeToken(this.tokenData.token);
        this.logger.log('AuthenticationService', 'tryLogin', `${JSON.stringify(user)}`);
    }

    onAuthenticationFailed(error: any) { 
        this.error = error;
        this.authenticated = false;
        this.logger.error('AuthenticationService', 'tryLogin', `${error}`);
    }

    tryLogin(username: string, password: string, onAuth?: any, onError?: any) { 
        return this.http.post<JWTToken>('/api/login', {
            username,
            password
        }, { headers: this.getAuthenticatedHeaders() })
        .subscribe((tokenData: JWTToken) => { 
            this.onAuthenticationSucceeded(tokenData)
            if (onAuth) { 
                onAuth(this.user)
            }
        }, (error: any) => { 
            this.onAuthenticationFailed(error)
            if (onError) [ 
                onError(error)
            ]
        })
    }
}

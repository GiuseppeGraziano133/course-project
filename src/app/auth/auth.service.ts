import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';

interface RegResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
}

interface LogResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered: true
}

export {RegResponseData, LogResponseData};

@Injectable({providedIn: 'root'})

export class AuthService {
    registerUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCyvIigt-EWmEhIRI0AeLYvDHSL1RouehA';
    loginUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCyvIigt-EWmEhIRI0AeLYvDHSL1RouehA';
    user = new BehaviorSubject<User>(null);
    private token: string = null;
    private timeout: any;

    constructor (private http: HttpClient, private router: Router) {}

    register(user: {email: string, password: string}) {
        return this.http.post<RegResponseData>(this.registerUrl, {
            email: user.email,
            password: user.password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(this.handleAuth.bind(this)));
    }

    login(user: {email: string, password: string}) {
        return this.http.post<LogResponseData>(this.loginUrl, {
            email: user.email,
            password: user.password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(this.handleAuth.bind(this)));
    }

    logout() {
        this.user.next(null);
        
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        localStorage.removeItem('email');
        localStorage.removeItem('password');
        this.router.navigate(['/auth']);
    }

    autoLogout(expirationDuration: number) {
        this.timeout = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuth(res: RegResponseData | LogResponseData) {
        const expiresIn = new Date(new Date().getTime() + +res.expiresIn * 1000);
        const user = new User(res.email, res.localId, res.idToken, expiresIn);
        this.token = user.token;
        this.autoLogout(+res.expiresIn * 1000);
        this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse) {
        if (!errorRes.error.error) {
            return throwError({code: 'Unknown', message: 'An unknown error occurred.'});
        }
        
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                return throwError({code: errorRes.error.error.code, message: 'Email already exist.'});
            case 'OPERATION_NOT_ALLOWED':
                return throwError({code: errorRes.error.error.code, message: 'The operation is not allowed.'});
            case 'TOO_MANY_ATTEMPTS_TRY_LATER':
                return throwError({code: errorRes.error.error.code, message: 'Too many attempts, please try later.'});
            case 'EMAIL_NOT_FOUND':
                return throwError({code: errorRes.error.error.code, message: "Email doesn't exist."});
            case 'INVALID_PASSWORD':
                return throwError({code: errorRes.error.error.code, message: 'Wrong password.'});
            case 'USER_DISABLED':
                return throwError({code: errorRes.error.error.code, message: 'This user is disabled.'});
            default:
                return throwError({code: errorRes.error.error.code, message: 'An error occurred.'});
        }
    }

    getToken() {
        return this.token;
    }
}
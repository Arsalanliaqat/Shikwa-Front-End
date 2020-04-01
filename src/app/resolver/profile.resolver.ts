import { Injectable, OnInit } from '@angular/core';
import { Resolve, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class ProfileResolver implements Resolve<any> {

    httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };

    constructor(
        private httpClient: HttpClient,
        private router: Router
    ) { }

    resolve() {
        this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        const profile = this.httpClient.get<any>(`${environment.apiUrl}/user`, this.httpOptions).toPromise();
        profile.then((data) => {
            return data;
        }).catch((error) => {
            if (error.status === 403 || error.status === 0) {
                localStorage.removeItem('token');
                localStorage.setItem('isLoggedIn', 'false');
                localStorage.removeItem('loginWith');
                void this.router.navigate(['/']);
            }
            else {
                console.log("Error getting response" + JSON.stringify(error));
            }
            return;
        });
    }
}

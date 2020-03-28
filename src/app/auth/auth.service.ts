import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyAuthService {

  constructor(private httpClient: HttpClient) { }

  public login(username: string, password: string) {
    return this.httpClient.post<any>(`${environment.apiUrl}/login`, { "email": username, "password": password }).toPromise();
  }

  public requestPasswordReset(email: string) {
    return this.httpClient.post(`${environment.apiUrl}/requestReset`, { email }, { responseType: 'text' }).toPromise();
  }

  public resetPassword(id: string, password: string, token: string) {
    return this.httpClient.post(`${environment.apiUrl}/resetPassword`, { password, id, token }, { responseType: 'text' }).toPromise();
  }

  public validateReset(id: string, token: string) {
    return this.httpClient.post(`${environment.apiUrl}/validateReset`, { id, token }, { responseType: 'text' }).toPromise();
  }

}

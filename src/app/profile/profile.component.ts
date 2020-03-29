import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  data: JSON;
  salutation: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string;
  landline: string;
  street: string;
  city: string;
  country: string;
  zip: string;
  description: string;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const profile = this.httpClient.get<any>(`${environment.apiUrl}/user`, this.httpOptions).toPromise();
    profile.then((data) => {
      this.firstname = data.firstName;
      this.lastname = data.lastName;
      this.email = data.email;
      this.street = data.street;
      this.city = data.city;
      this.zip = data.zip;
      this.country = data.country;
      this.salutation = data.gender ? data.gender : '';

      // this.username = data.username;
      // this.phone = data.phone;
      // this.landline = data.landline;
      // this.description = data.description;
    }).catch((error) => {
      console.log("Error getting response" + JSON.stringify(error));
    });
  }

  onSubmit(f: NgForm) {
    const profileData = {
      "firstName": this.firstname,
      "lastName": this.lastname,
      "email": this.email,
      "street": this.street,
      "city": this.city,
      "zip": this.zip,
      "country": this.country,
      // "salutation": this.salutation,
      // "username": this.username,
      // "phone": this.phone,
      // "landline": this.landline,
      // "description": this.description
    }

    const profile = this.httpClient.post<any>(`${environment.apiUrl}/user`, profileData, this.httpOptions).toPromise();
    profile.then((data) => {
      // console.log(data);
    }).catch((error) => {
      console.log("Error getting response" + JSON.stringify(error));
    });

  }
}

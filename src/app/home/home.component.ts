import { Component, OnInit, HostListener, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MyAuthService } from '../auth/auth.service';
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public isCollapsed = true;
  signinToggle = true;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  userPhone: Number;
  userPassword: string;
  userRPassword: string;
  firstName: String;
  lastName: String;
  userEmail: String;
  userStreet: String;
  userCity: String;
  userZip: Number;
  userCountry: String;
  passwordRepeatError: String;

  emailAddress: string;
  password: string;
  errorText: string;
  signupErrorText: string;
  redirectToSubmitReport = false;

  private user: SocialUser;
  private loggedIn: boolean;

  modalReference: NgbModalRef;
  @ViewChild('signin', { read: TemplateRef }) signinModal: TemplateRef<any>;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private myAuthService: MyAuthService,
    private authService: AuthService,
    private httpClient: HttpClient
  ) {
    localStorage.setItem('isLoggedIn', 'false');
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'backdrop';
    } else {
      return reason;
    }
  }

  public open(content) {
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-signin', centered: true });
    this.modalReference.result.then((result) => {
    }, (reason) => {
      if ((this.getDismissReason(reason) === 'backdrop') || (this.getDismissReason(reason) === 'ESC')) {
        this.signinToggle = true;
      }
    });
  }

  public collapse() {
    this.isCollapsed = !this.isCollapsed;
    const navbar = document.getElementsByTagName('nav')[0];
    console.log(navbar);
    if (!this.isCollapsed) {
      navbar.classList.remove('navbar-transparent');
      navbar.classList.add('bg-white');
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('bg-white');
    }
  }

  loginAndReport(value: boolean) {
    if (value) {
      this.redirectToSubmitReport = value;
      this.modalService.open(this.signinModal, { centered: true });
    }
  }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.modalReference) {
        this.modalReference.close();
      }
      if (this.loggedIn) {
        this.signInHandler('Social');
        localStorage.setItem('token', `${user.authToken}`);
      }
      if (!user) {
        void this.router.navigate(['/welcome']);
      }
    });
  }

  @HostListener('window:storage')
  onStorageChange() {
    console.log(localStorage.getItem('isLoggesIn'));
  }

  signInHandler(loginMethod: String) {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginWith', `${loginMethod}`);
    if (this.redirectToSubmitReport) {
      if (this.modalReference) {
        this.modalReference.close();
      }
      void this.router.navigate(['submit-reports']);
    } else {
      void this.router.navigate(['dashboard']);
    }
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => {
      // console.log(x);
    });
  }

  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(x => {
      // console.log(x)
    });
  }

  async onSubmit(action: string, form: NgForm) {
    if (action === 'login') {
      this.signin();
      const result = await this.myAuthService.login(this.emailAddress, this.password);
      if (result.type === 'OK') {
        if (this.modalReference) {
          this.modalReference.close();
        }
        localStorage.setItem('token', result.token);
        localStorage.setItem('userId', result.userId);
        this.signInHandler('Email');
      } else if (result.type === 'ERROR') {
        this.errorText = result.msg;
      }
    }
    if (action === "signup") {
      if (this.userPassword !== this.userRPassword) {
        this.passwordRepeatError = "Password do not match";
      } else {
        this.signupErrorText = 'Please wait';
        this.passwordRepeatError = null;
        const signupDetails = {
          "email": this.userEmail,
          "password": this.userPassword,
          "firstName": this.firstName,
          "lastName": this.lastName,
          "phoneNumber": this.userPhone,
          "street": this.userStreet,
          "city": this.userCity,
          "zip": this.userZip,
          "country": this.userCountry,
          "userName": null,
          "landlineNumber": null,
          "gender": null,
          "description": null
        };
        const user = this.httpClient.post<any>(`${environment.apiUrl}/user/register`, signupDetails, this.httpOptions).toPromise();
        user.then((data) => {
          console.log(data);
          if(data.type === 'OK') {
            this.errorText = "Registration Successfull, Login please";
            this.signinToggle = true;
            form.resetForm();
          } else if (data.type === 'ERROR') {
            this.signupErrorText = data.msg;
          }
        }).catch((error) => {
          this.signupErrorText = "Connectivity problems";
          console.log("Error getting response" + JSON.stringify(error));
        });
      }
    }
  }

  public signin() {
    this.signinToggle = true;
  }

  public registration() {
    this.signinToggle = false;
  }

  public cancel() {
    this.signinToggle = true;
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}

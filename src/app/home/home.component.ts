import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MyAuthService } from '../auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";
import { SocialUser } from "angularx-social-login";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public isCollapsed = true;
  signinToggle = true;

  emailAddress: string;
  password: string;
  errorText: string;

  private user: SocialUser;
  private loggedIn: boolean;

  modalReference: NgbModalRef;

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private myAuthService: MyAuthService,
    private authService: AuthService
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

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      if(this.modalReference) {
        this.modalReference.close();
      }
      if (this.loggedIn) {
        this.signInHandler('Social');
        localStorage.setItem('token', `${user.authToken}`);
      }
      if (!user) {
        void this.router.navigate(['/']);
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
    void this.router.navigate(['dashboard']);
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

  async onSubmit(action: string) {
    if (action === 'login') {
      this.signin();
      try {
        const result = await this.myAuthService.login(this.emailAddress, this.password);
        this.modalReference.close();
        console.log(result);
        localStorage.setItem('token', result.token);
        this.signInHandler('Email');
      } catch (err) {
        if (err instanceof HttpErrorResponse) {
          console.log(err);
          if (err.status === 401) {
            this.errorText = 'Email or password is wrong.';
            console.log(this.errorText);
          } else {
            this.errorText = `Encountered error (status ${err.status})`;
            console.log(this.errorText);
          }
        } else {
          this.errorText = 'Encountered unexpected error';
          console.log(this.errorText);
        }
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
}

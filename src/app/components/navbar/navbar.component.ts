import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from "angularx-social-login";
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  private listTitles: any[];
  location: Location;
  mobile_menu_visible: any = 0;
  private toggleButton: any;
  private sidebarVisible: boolean;
  confirmPasswordError: string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  modalReference: NgbModalRef;
  public isCollapsed = true;

  updatePasswordStatus: string;

  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private httpClient: HttpClient,
  ) {

    this.location = location;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.router.events.subscribe((event) => {
      this.sidebarClose();
      var $layer: any = document.getElementsByClassName('close-layer')[0];
      if ($layer) {
        $layer.remove();
        this.mobile_menu_visible = 0;
      }
    });
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
    this.modalReference = this.modalService.open(content, { ariaLabelledBy: 'modal-changePassword', centered: true });
    this.modalReference.result.then((result) => {
    }, (reason) => {
      if ((this.getDismissReason(reason) === 'backdrop') || (this.getDismissReason(reason) === 'ESC')) {
      }
    });
  }


  collapse() {
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

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];
    const html = document.getElementsByTagName('html')[0];
    if (window.innerWidth < 991) { mainPanel.style.position = 'fixed' }
    setTimeout(function () { toggleButton.classList.add('toggled') }, 500);
    html.classList.add('nav-open');
    this.sidebarVisible = true;
  };

  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    this.toggleButton.classList.remove('toggled');
    const mainPanel = <HTMLElement>document.getElementsByClassName('main-panel')[0];

    if (window.innerWidth < 991) {
      setTimeout(() => { mainPanel.style.position = '' }, 500);
    }
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };

  sidebarToggle() {
    var $toggle = document.getElementsByClassName('navbar-toggler')[0];
    (this.sidebarVisible === false) ? this.sidebarOpen() : this.sidebarClose();
    const html = document.getElementsByTagName('html')[0];

    if (this.mobile_menu_visible == 1) {
      html.classList.remove('nav-open');
      if ($layer) { $layer.remove() }

      setTimeout(() => { $toggle.classList.remove('toggled') }, 400);
      this.mobile_menu_visible = 0;
    } else {
      setTimeout(() => { $toggle.classList.add('toggled') }, 430);
      var $layer = document.createElement('div');
      $layer.setAttribute('class', 'close-layer');

      if (html.querySelectorAll('.main-panel')) {
        document.getElementsByClassName('main-panel')[0].appendChild($layer);
      } else if (html.classList.contains('off-canvas-sidebar')) {
        document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
      }

      setTimeout(function () { $layer.classList.add('visible') }, 100);

      $layer.onclick = function () {
        html.classList.remove('nav-open');
        this.mobile_menu_visible = 0;
        $layer.classList.remove('visible');
        setTimeout(function () {
          $layer.remove();
          $toggle.classList.remove('toggled');
        }, 400);
      }.bind(this);

      html.classList.add('nav-open');
      this.mobile_menu_visible = 1;

    }
  };

  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee.charAt(0) === '#') { titlee = titlee.slice(2); }
    titlee = titlee.split('/').pop();

    for (var item = 0; item < this.listTitles.length; item++) {
      if (this.listTitles[item].path === titlee) {
        return this.listTitles[item].title;
      }
    }
    return 'Dashboard';
  }

  async logout() {
    if (localStorage.getItem('loginWith') === 'Email') {
      void this.router.navigate(['/']);
      localStorage.removeItem('token');
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('loginWith');
    }
    else if ((localStorage.getItem('loginWith') === 'Social')) {
      this.authService.signOut();
      localStorage.removeItem('token');
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('loginWith');
    }
  }

  updatePassword() {
    const newPasswordData = {
      "oldPassword": this.oldPassword,
      "newPassword": this.confirmPassword
    }
    if (this.newPassword !== this.confirmPassword) {
      this.confirmPasswordError = "Password do not match";
    } else {
      const passwords = this.httpClient.post<any>(`${environment.apiUrl}/user/password`, newPasswordData, this.httpOptions).toPromise();
      passwords.then((data) => {
        if (data.Type === 'OK') {
          localStorage.setItem('token', data.token);
          this.updatePasswordStatus = 'Password Changed Successfully';
        }
      }).catch((error) => {
        if (error.status === 403 || error.status === 0) {
          if (localStorage.getItem('loginWith') === 'Email') {
            void this.router.navigate(['/']);
            localStorage.removeItem('token');
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('loginWith');
          }
          else if ((localStorage.getItem('loginWith') === 'Social')) {
            this.authService.signOut();
            localStorage.removeItem('token');
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('loginWith');
          }
        }
        else {
          console.log("Error getting response" + JSON.stringify(error));
        }
      });
    }
  }
}

import { Component, OnInit, TemplateRef, ViewChild, Input, ElementRef, HostListener } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class Reports implements OnInit {

  public modalReference: NgbModalRef;
  public detailsObject: JSON;
  @ViewChild('content', { read: TemplateRef }) content: TemplateRef<any>;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  products: JSON;

  constructor(
    private modalService: NgbModal,
    private httpClient: HttpClient,
    private router: Router,
    private authService: AuthService
  ) { }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public open(content, product: JSON) {
    if (product) {
      this.detailsObject = product;
      this.modalReference = this.modalService.open(content, { size: 'lg' });
      this.modalReference.result.then((result) => {
      }, (reason) => {
        if ((this.getDismissReason(reason) === 'backdrop') || (this.getDismissReason(reason) === 'ESC')) {
        }
      });
    }
  }

  ngOnInit() {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const response = this.httpClient.get<any>(`${environment.apiUrl}/product`, this.httpOptions).toPromise();
    response.then((data) => {
      this.products = data;
    }).catch((error) => {
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
    });
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

}

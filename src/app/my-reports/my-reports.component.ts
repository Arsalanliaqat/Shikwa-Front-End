import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AuthService } from "angularx-social-login";

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.css']
})
export class MyReports implements OnInit, OnDestroy {

  public modalReference: NgbModalRef;
  public detailsObject: JSON;
  searchField: string;

  @ViewChild('content', { read: TemplateRef }) content: TemplateRef<any>;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  itemsPerPage: number = 10;
  currentPage: number = 1;
  absoluteIndex(indexOnPage: number): number {
    return this.itemsPerPage * (this.currentPage - 1) + indexOnPage;
  }

  products: JSON;
  swapProducts: JSON;
  searchMode: boolean = false;

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
    const response = this.httpClient.get<any>(`${environment.apiUrl}/user/${localStorage.getItem('userId')}/product`, this.httpOptions).toPromise();
    response.then((data) => {
      this.products = data;
    }).catch((error) => {
      console.log(error);
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

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

  searchRecords() {
    const response = this.httpClient.get<any>(`${environment.apiUrl}/products?q=${this.searchField}&uid${localStorage.getItem('userId')}`, this.httpOptions).toPromise();
    response.then((data) => {
      this.searchMode = true;
      this.swapProducts = this.products;
      this.products = data;
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

  clearSearch() {
    this.products = this.swapProducts;
    this.swapProducts = null;
    this.searchField = '';
    this.searchMode = false;
  }
}

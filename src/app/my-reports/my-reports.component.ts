import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-my-reports',
  templateUrl: './my-reports.component.html',
  styleUrls: ['./my-reports.component.css']
})
export class MyReports implements OnInit, OnDestroy {

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
    private httpClient: HttpClient
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
      console.log("Error getting response" + JSON.stringify(error));
    });
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }

}

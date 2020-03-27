import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public isCollapsed = true;

  signinToggle = true;

  constructor(
    private router: Router,
    private modalService: NgbModal
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

  public open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-signin', centered: true }).result.then((result) => {
    }, (reason) => {
      if (this.getDismissReason(reason) === 'Search') {

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

  public signin() {
    this.signinToggle = true;
  }

  public registration() {
    this.signinToggle = false;
  }

  public cancel(){
    this.signinToggle= true;
  }
}

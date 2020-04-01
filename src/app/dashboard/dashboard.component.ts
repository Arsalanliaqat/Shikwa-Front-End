import { Component, ViewChild, TemplateRef, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { createWorker } from 'tesseract.js';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
const Jimp = require('jimp');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('content', { read: TemplateRef }) content: TemplateRef<any>;
  @Output() loginAndReport = new EventEmitter();

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  private rotation = 0;
  private scale = 1;

  public transform: ImageTransform = {};
  public selectedImage: File = null;
  public croppedImage: any = '';
  public canvasRotation = 0;

  public modalReference: NgbModalRef;
  public show = 'loading';

  public product = '';
  public method = '';
  public searchError: string;
  public currentStatus: string;
  public searchResult: JSON;

  public formInputItem: string;
  public formInputPlaceholder: string;

  public config: DropzoneConfigInterface = {
    clickable: true,
    maxFiles: 1,
    autoReset: null,
    errorReset: null,
    cancelReset: null,
    acceptedFiles: 'image/*',
    thumbnailHeight: 1100,
    thumbnailWidth: 1500
  };

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    this.formInputItem = 'Product Model';
    this.formInputPlaceholder = 'Product Model i.e. XBHTR-123';
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  public imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  public rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  public rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  public flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  public flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  public resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  public zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  public zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  public cancel() {
    this.selectedImage = null;
  }

  public open(content) {
    this.modalReference = this.modalService.open(content, { size: 'lg' });
    if (this.show === 'manual') {
      this.method = 'model';
    }
    this.modalReference.result.then((result) => {
    }, (reason) => {
      if ((this.getDismissReason(reason) === 'backdrop') || (this.getDismissReason(reason) === 'ESC')) {
      }
    });
  }

  public async scan() {
    this.show = 'loading';
    this.open(this.content);
    await this.processImage();
    this.runOCR(this.croppedImage);
  }

  public async processImage() {
    this.currentStatus = 'Processing image to enhance OCR Result';
    const image = await Jimp.read(this.croppedImage);
    await image.greyscale();
    await image.contrast(0.3);
    this.croppedImage = await image.getBase64Async(Jimp.AUTO);
  }

  public onUploadInit(args: any): void {
    console.log('onUploadInit:', args);
  }

  public onUploadError(args: any): void {
    console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    console.log('onUploadSuccess:', args[0]);
    this.selectedImage = args[0];
  }

  async runOCR(image: any) {
    this.currentStatus = 'Running OCR on the image';
    const worker = createWorker({ logger: m => { /* console.log(m)*/ }, });
    await worker.load();
    await worker.loadLanguage('eng+deu');
    await worker.initialize('eng+deu');
    const { data: { text } } = await worker.recognize(image);
    this.product = text;
    this.show = 'manual';
    this.method = 'model';
    await worker.terminate();
  }

  public searchProduct() {
    if (this.product !== '') {
      this.searchError = 'Searching...';
      const result = this.httpClient.get<any>(`${environment.apiUrl}/verify?q=${this.product}&t=${this.method.toUpperCase()}`, this.httpOptions).toPromise();
      result.then((data) => {
        this.searchResult = data;
        this.show = 'result';
        this.searchError = '';
        if (data.length) {
          (this.method === 'model') ? localStorage.setItem('model', `${this.product}`) : localStorage.setItem('product', `${this.product}`);
          this.method = 'model';
          this.product = '';
        }
      }).catch((error) => {
        this.searchError = "Error getting response" + JSON.stringify(error);
      });
    }
    else {
      this.searchError = 'Search field is empty';
    }
  }

  public report() {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      void this.router.navigate(['/submit-reports']);
      this.modalReference.close();
    } else {
      this.loginAndReport.emit(true);
      this.modalReference.close();
    }
  }

  goBackToSearch() {
    this.show = 'manual';
    this.searchResult = null;
  }

  onMethodChange(value: string) {
    this.formInputItem = (value === 'model') ? 'Product Model' : 'Product Name';
    this.formInputPlaceholder = (value === 'model') ? 'Product Model i.e. XBHTR-123' : 'Product Name i.e. Apple Iphone 11 Pro Max';
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}

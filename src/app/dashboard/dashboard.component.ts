import { Component, ViewChild, TemplateRef } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { createWorker } from 'tesseract.js';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
const Jimp = require('jimp');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  private rotation = 0;
  private scale = 1;

  @ViewChild('content', { read: TemplateRef }) content: TemplateRef<any>;
  @ViewChild('result', { read: TemplateRef }) result: TemplateRef<any>;

  public modalReference: NgbModalRef;
  public closeResult = '';
  public selectedImage: File = null;
  public croppedImage: any = '';
  public canvasRotation = 0;
  public transform: ImageTransform = {};
  // public brand = '';
  // public category = '';
  // public product = '';
  // public model = ''
  public brand = 'Sony Inter-American S.A';
  public category = 'Multimedia';
  public product = 'LED TV';
  public model = 'XBR-49X855B';
  public valid = true;
  public show = 'loading';
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

  constructor(private modalService: NgbModal) { }

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

  public open(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then((result) => {
    }, (reason) => {
      if ((this.getDismissReason(reason) === 'backdrop') || (this.getDismissReason(reason) === 'ESC')) {
      }
    });
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

  public async scan() {
    this.show = 'loading';
    await this.processImage();
    this.runOCR(this.croppedImage);
    this.modalService.open(this.content);
  }

  public async processImage() {
    const image = await Jimp.read(this.croppedImage);
    await image.greyscale();
    await image.contrast(0.3);
    this.croppedImage = await image.getBase64Async(Jimp.AUTO);
  }

  public onUploadInit(args: any): void {
    // console.log('onUploadInit:', args);
  }

  public onUploadError(args: any): void {
    // console.log('onUploadError:', args);
  }

  public onUploadSuccess(args: any): void {
    // console.log('onUploadSuccess:', args[0]);
    this.selectedImage = args[0];
  }

  async runOCR(image: any) {
    const worker = createWorker({
      logger: m => {
        // console.log(m)
      },
    });
    await worker.load();
    await worker.loadLanguage('eng+deu');
    await worker.initialize('eng+deu');
    console.log('OCR Applying');
    const { data: { text } } = await worker.recognize(image);
    this.brand = 'Sony Inter-American S.A';
    this.category = 'Multimedia';
    this.product = 'LED TV';
    this.model = 'XBR-49X855B';
    this.show = 'manual';
    console.log(text);
    await worker.terminate();
  }

  public report() {
    console.log('report');
  }
}

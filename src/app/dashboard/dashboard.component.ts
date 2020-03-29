import { Component, ViewChild, TemplateRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { createWorker } from 'tesseract.js';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
const Jimp = require('jimp');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy {

  mynewresponse = [
    {
      "brand": "Sony Inter-American S.A",
      "category": "Multimedia",
      "product": "LED TV",
      "model": "XBR-49X855B",
      "Image_Path": "https://chapmanworld.com/wp-content/uploads/2015/03/soap__large.jpg",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In venenatis ac dui sed tincidunt. Donec neque ipsum, suscipit ac pellentesque ac, vehicula sit amet lectus. Etiam nulla lectus, ullamcorper ac ligula commodo, vehicula luctus quam. Quisque fringilla auctor accumsan. Aenean feugiat ligula massa, a egestas mauris dignissim at. Nam gravida purus quis magna finibus laoreet. Curabitur vel quam ut ex lobortis venenatis. Aliquam luctus maximus ante, ut elementum elit. In luctus tincidunt augue nec maximus. Donec viverra, enim non porta vestibulum, urna sapien cursus sem, et auctor velit purus sed est. Vestibulum a nunc quis enim imperdiet vestibulum a nec lorem. Donec neque justo, fermentum quis venenatis semper, suscipit vitae sem. Duis finibus consequat elit in pharetra.",
      "valid": "valid"
    },
    {
      "brand": "Sony Inter-American S.A",
      "category": "Multimedia",
      "product": "LED TV",
      "model": "XBR-49X855B",
      "Image_Path": "https://chapmanworld.com/wp-content/uploads/2015/03/soap__large.jpg",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In venenatis ac dui sed tincidunt. Donec neque ipsum, suscipit ac pellentesque ac, vehicula sit amet lectus. Etiam nulla lectus, ullamcorper ac ligula commodo, vehicula luctus quam. Quisque fringilla auctor accumsan. Aenean feugiat ligula massa, a egestas mauris dignissim at. Nam gravida purus quis magna finibus laoreet. Curabitur vel quam ut ex lobortis venenatis. Aliquam luctus maximus ante, ut elementum elit. In luctus tincidunt augue nec maximus. Donec viverra, enim non porta vestibulum, urna sapien cursus sem, et auctor velit purus sed est. Vestibulum a nunc quis enim imperdiet vestibulum a nec lorem. Donec neque justo, fermentum quis venenatis semper, suscipit vitae sem. Duis finibus consequat elit in pharetra.",
      "valid": "invalid"
    },
    {
      "brand": "Sony Inter-American S.A",
      "category": "Multimedia",
      "product": "LED TV",
      "model": "XBR-49X855B",
      "Image_Path": "https://chapmanworld.com/wp-content/uploads/2015/03/soap__large.jpg",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In venenatis ac dui sed tincidunt. Donec neque ipsum, suscipit ac pellentesque ac, vehicula sit amet lectus. Etiam nulla lectus, ullamcorper ac ligula commodo, vehicula luctus quam. Quisque fringilla auctor accumsan. Aenean feugiat ligula massa, a egestas mauris dignissim at. Nam gravida purus quis magna finibus laoreet. Curabitur vel quam ut ex lobortis venenatis. Aliquam luctus maximus ante, ut elementum elit. In luctus tincidunt augue nec maximus. Donec viverra, enim non porta vestibulum, urna sapien cursus sem, et auctor velit purus sed est. Vestibulum a nunc quis enim imperdiet vestibulum a nec lorem. Donec neque justo, fermentum quis venenatis semper, suscipit vitae sem. Duis finibus consequat elit in pharetra.",
      "valid": "dangerous"
    },
    {
      "brand": "Sony Inter-American S.A",
      "category": "Multimedia",
      "product": "LED TV",
      "model": "XBR-49X855B",
      "Image_Path": "https://chapmanworld.com/wp-content/uploads/2015/03/soap__large.jpg",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In venenatis ac dui sed tincidunt. Donec neque ipsum, suscipit ac pellentesque ac, vehicula sit amet lectus. Etiam nulla lectus, ullamcorper ac ligula commodo, vehicula luctus quam. Quisque fringilla auctor accumsan. Aenean feugiat ligula massa, a egestas mauris dignissim at. Nam gravida purus quis magna finibus laoreet. Curabitur vel quam ut ex lobortis venenatis. Aliquam luctus maximus ante, ut elementum elit. In luctus tincidunt augue nec maximus. Donec viverra, enim non porta vestibulum, urna sapien cursus sem, et auctor velit purus sed est. Vestibulum a nunc quis enim imperdiet vestibulum a nec lorem. Donec neque justo, fermentum quis venenatis semper, suscipit vitae sem. Duis finibus consequat elit in pharetra.",
      "valid": "invalid"
    },
  ]

  private rotation = 0;
  private scale = 1;

  @ViewChild('content', { read: TemplateRef }) content: TemplateRef<any>;
  @ViewChild('result', { read: TemplateRef }) result: TemplateRef<any>;
  @Output() loginAndReport = new EventEmitter();

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
  public Image_Path = 'https://chapmanworld.com/wp-content/uploads/2015/03/soap__large.jpg';
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

  constructor(
    private modalService: NgbModal,
    private router: Router,
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
    this.modalReference = this.modalService.open(content, { size: 'lg' });
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
    // this.brand = 'Sony Inter-American S.A';
    // this.category = 'Multimedia';
    // this.product = 'LED TV';
    // this.model = 'XBR-49X855B';
    this.show = 'manual';
    console.log(text);
    await worker.terminate();
  }

  public report() {
    const loggedIn = localStorage.getItem('isLoggedIn');
    localStorage.setItem('model', `${this.model}`);
    localStorage.setItem('category', `${this.category}`);
    localStorage.setItem('product', `${this.product}`);
    localStorage.setItem('brand', `${this.brand}`);
    if (loggedIn === 'true') {
      void this.router.navigate(['/submit-reports']);
      this.modalReference.close();
    } else {
      this.loginAndReport.emit(true);
      this.modalReference.close();
    }
  }

  ngOnDestroy() {
    this.modalService.dismissAll();
  }
}

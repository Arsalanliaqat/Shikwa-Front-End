import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Data } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-submit-report',
  templateUrl: './submit-report.component.html',
  styleUrls: ['./submit-report.component.css']
})
export class SubmitReport implements OnInit, OnChanges {

  @ViewChild('f') submitForm: NgForm;

  submitStatus: string;
  brand: string;
  category: string;
  product: string;
  model: string;
  country: string;
  city: string;
  risk: string;
  description: string;
  fileName: string[] = [];
  fileToUpload: File[] = [];

  httpOptions = {
    headers: new HttpHeaders({
    })
  };

  constructor(
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.model = localStorage.getItem('model');
    this.product = localStorage.getItem('product');
  }

  handleFileInput(files: FileList) {
    this.fileToUpload.push(files[0]);
    const currentIndex = this.fileToUpload.length - 1;
    this.fileName.push(this.fileToUpload[currentIndex].name);
  }

  removeFile(index: number) {
    if (index !== -1) {
      this.fileName.splice(index, 1);
      this.fileToUpload.splice(index, 1);
    }
  }

  onSubmit(form: NgForm) {
    const formData = new FormData();
    this.fileToUpload.forEach((file) => {
      formData.append("file", file);
    })
    formData.append("userId", localStorage.getItem('userId'));
    formData.append("productBrand", this.brand);
    formData.append("productCategory", this.category);
    formData.append("productName", this.product);
    formData.append("productModel", this.model);
    formData.append("countryOrigin", this.country);
    formData.append("cityOrigin", this.city);
    formData.append("riskType", this.risk);
    formData.append("description", this.description);

    const profile = this.httpClient.post<Data>(`${environment.apiUrl}/product`, formData, this.httpOptions).toPromise();
    profile.then((data) => {
      console.log(data);
      if (data.type === 'OK') {
        this.submitStatus = 'Report Submitted Successfully';
        localStorage.removeItem('model');
        localStorage.removeItem('product');
        form.resetForm();
        this.fileToUpload = [];
        this.fileName = [];
      }
      else {
        this.submitStatus = data.msg;
        console.log(data);
      }
    }).catch((error) => {
      console.log(error);
      console.log("Error getting response" + JSON.stringify(error));
    });
  }

  ngOnChanges() {
    if (!this.fileToUpload) {
      this.submitForm.controls['selectedFiles'].setErrors({ 'incorrect': true });
    }
  }

}

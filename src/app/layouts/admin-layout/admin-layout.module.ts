import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { ProfileComponent } from '../../profile/profile.component';
import { SubmitReport } from '../../submit-report/submit-report.component';
import { MyReports } from '../../my-reports/my-reports.component';
import { Reports } from '../../reports/reports.component';
import { LocationComponent } from '../../location/location.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { DashboardComponent } from '../../dashboard/dashboard.component'
import { DropzoneModule, DropzoneConfigInterface, DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  url: 'https://httpbin.org/post',
  acceptedFiles: 'image/*',
  createImageThumbnails: true
};


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    DropzoneModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    SubmitReport,
    MyReports,
    Reports,
    LocationComponent,
    NotificationsComponent,
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ]
})

export class AdminLayoutModule { }

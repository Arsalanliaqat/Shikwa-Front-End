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
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DashboardModule } from '../../dashboard/dashboard.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ChartsModule,
    NgbModule,
    DropzoneModule,
    DashboardModule,
    NgxPaginationModule,
    ImageCropperModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    ProfileComponent,
    SubmitReport,
    MyReports,
    Reports,
    LocationComponent,
    NotificationsComponent,
  ]
})

export class AdminLayoutModule { }

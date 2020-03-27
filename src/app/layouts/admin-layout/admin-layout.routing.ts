import { Routes } from '@angular/router';
import { ProfileComponent } from '../../profile/profile.component';
import { SubmitReport } from '../../submit-report/submit-report.component';
import { MyReports } from '../../my-reports/my-reports.component';
import { Reports } from '../../reports/reports.component';
import { LocationComponent } from '../../location/location.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { DashboardComponent } from '../../dashboard/dashboard.component'

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'submit-reports', component: SubmitReport },
    { path: 'my-reports', component: MyReports },
    { path: 'reports', component: Reports },
    { path: 'location', component: LocationComponent },
    { path: 'notifications', component: NotificationsComponent },
]   
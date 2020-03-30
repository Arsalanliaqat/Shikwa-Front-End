import { Routes } from '@angular/router';
import { ProfileComponent } from '../../profile/profile.component';
import { SubmitReport } from '../../submit-report/submit-report.component';
import { MyReports } from '../../my-reports/my-reports.component';
import { Reports } from '../../reports/reports.component';
import { LocationComponent } from '../../location/location.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { DashboardComponent } from '../../dashboard/dashboard.component'
import { AuthGuard } from '../../auth/guards/auth.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'submit-reports', component: SubmitReport, canActivate: [AuthGuard] },
    { path: 'my-reports', component: MyReports, canActivate: [AuthGuard] },
    { path: 'reports', component: Reports, canActivate: [AuthGuard] },
    { path: 'location', component: LocationComponent, canActivate: [AuthGuard] },
    { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
]   
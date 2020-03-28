import { Component, OnInit } from '@angular/core';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'shopping_shop', class: '' },
    { path: '/profile', title: 'Profile',  icon:'users_single-02', class: '' },
    { path: '/location', title: 'My Location',  icon:'location_map-big', class: '' },
    { path: '/submit-reports', title: 'Submit Reports',  icon:'files_paper', class: '' },
    { path: '/my-reports', title: 'My Reports',  icon:'design_bullet-list-67', class: '' },
    { path: '/reports', title: 'All Reports',  icon:'files_box', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}

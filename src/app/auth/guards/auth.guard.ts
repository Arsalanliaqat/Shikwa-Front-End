import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(): boolean { 
        if (this.isLoggedIn()) { return true; }
        this.router.navigate(['welcome']);
        return false;
    }
    isLoggedIn = (): boolean => localStorage.getItem('isLoggedIn') === 'true'
}  
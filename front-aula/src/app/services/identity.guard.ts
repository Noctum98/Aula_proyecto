import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable()
export class IdentityGuard implements CanActivate {
    constructor(
        private _userService:UserService,
        private _router:Router
    ){ }

    canActivate() {
        let user = this._userService.getUser();

        if(user){
            return true;
        }else{
            return this._router.navigate(['/login']);
        }
    }
}
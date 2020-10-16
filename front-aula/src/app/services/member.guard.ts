import { Injectable } from '@angular/core';
import {  CanActivate, Router } from '@angular/router';
import { ClassroomService } from './classroom.service';
import { MemberService } from './member.service';
import { UserService } from './user.service';

@Injectable({providedIn: 'root'})
export class MemberGuard implements CanActivate {
    constructor(
        private _classroomService:ClassroomService,
        private _memberService:MemberService,
        private _userService:UserService,
        private _router:Router
    ) { }

    canActivate() {
        let classroom = this._classroomService.getClassroom();
        let member = this._memberService.getMember();
        let user = this._userService.getUser();

        if(classroom && (classroom.user_id == user.sub || member && member.user_id == user.sub )){
            return true;
        }else{
            this._router.navigate(['/error']);
        }
    }
}
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ClassroomService } from './classroom.service';
import { MemberService } from './member.service';

@Injectable()
export class TeacherGuard implements CanActivate {
    constructor(
        private _classroomService:ClassroomService,
        private _memberService:MemberService,
        private _router:Router
    ){ }

    canActivate() {
        let classroom = this._classroomService.getClassroom();
        let member = this._memberService.getMember();

        if(classroom && (classroom.user_id || member && member.role == 'ROLE_TEACHER')){
            return true;
        }else{
            return this._router.navigate(['/error']);
        }
    }
}
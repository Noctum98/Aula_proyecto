import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MemberService } from '../../services/member.service';
import { ClassroomService } from '../../services/classroom.service';
import { Member } from 'src/app/models/member';
import { Router } from '@angular/router';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
  providers:[UserService,MemberService,ClassroomService]
})
export class MembersComponent implements OnInit {
  public token:string;
  public classroom:any;
  public member:Member;
  public status:string;
  public changing:boolean;
  public members:Array<any>;

  constructor(
    private _userService:UserService,
    private _memberService:MemberService,
    private _clasroomService:ClassroomService,
    private _router:Router
  ) {
    this.token = this._userService.getToken();
    this.classroom = this._clasroomService.getClassroom();
    this.member = new Member(1,1,"","","");
    this.changing = false;
  }

  ngOnInit(): void {
    if(this.classroom && this.classroom.user_id){
      this.getMembers();
    }else{
      this._router.navigate(['/error']);
    }
  }

  getMembers(){
    this._memberService.members(this.classroom.id,this.token).subscribe(
      response => {
        if(response.status = 'success' && !response.message){
          this.members = response.members;
        }else{
          this.members = response;
        }
      },
      error => { 
        console.log(<any>error);
      }
    );
  }
  changeRole(role:string,id){
    this.changing = true;
    this.member.role = role;
    this.member.id = id;
    this._memberService.setRole(this.member,this.member.id,this.token).subscribe(
      response => {
        if(response.status = 'success'){
          this.changing = false;
          this.getMembers();
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}

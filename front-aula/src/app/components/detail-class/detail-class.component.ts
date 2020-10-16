import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { ClassroomService } from '../../services/classroom.service';
import { UserService } from '../../services/user.service';
import { MemberService } from '../../services/member.service';
import { TaskService } from '../../services/task.service'; 
import { Member } from 'src/app/models/member';

@Component({
  selector: 'app-detail-class',
  templateUrl: './detail-class.component.html',
  styleUrls: ['./detail-class.component.css'],
  providers: [
    ClassroomService,
    UserService,
    MemberService,
    TaskService
  ]
})
export class DetailClassComponent implements OnInit {
  public token:string;
  public user:any;
  public classroom:any;
  public member:Member;
  public tasks:Array<any>;
  public status:boolean;

  constructor(
    private _router:Router,
    private _route:ActivatedRoute,
    private _classroomService:ClassroomService,
    private _userService:UserService,
    private _memberService:MemberService,
    private _taskService:TaskService
  ){
    this.token = this._userService.getToken();
    this.user = this._userService.getUser();
    this.status = false;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params=>{
      let id = params.id;
      this.getClass(id);
    });
  }

  getClass(id){
    this._classroomService.detail(id,this.token).subscribe(
      response =>{
        if(response.status == 'success'){
          // ASigno la calse y busco el miembro en caso de que no sea el dueño
          if(!response.classroom.user_id){
            this.getMember(response.classroom.id,this.user.sub);
          }
          this.classroom = response.classroom;
          this.getTasks(this.classroom.id);
          sessionStorage.setItem('class',JSON.stringify(response.classroom));
        }
      },
      error => {
        this._router.navigate(['/error']);
      }
    );
  }
  getMember(classroom_id,user_id){
    this._memberService.Member(classroom_id,this.token).subscribe(
      response => {
        if(response.status == 'success'){
          sessionStorage.setItem('member',JSON.stringify(response.member));
          this.member = this._memberService.getMember();
        }else{
          console.log('Error al encontrar el miembro');
        }        
      },
      error => {
        this._router.navigate(['/error']);
      }
    );
  }
  getTasks(classroom_id){
    this._taskService.tasks(classroom_id,this.token).subscribe(
      response => {
        if(response.status == 'success'){
          this.tasks = response.tasks;
        }
      },
      error => {
        this.tasks = null;
      }
    );
  }
}

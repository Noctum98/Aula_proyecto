import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { MemberService } from '../../services/member.service';
import { Global } from '../../services/global';
import { Task } from 'src/app/models/task';



@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
  providers:[TaskService,UserService,MemberService]
})
export class TaskComponent implements OnInit {
  public token:string;
  public task:Task;
  public member:any;
  public url:string;
  public condition:boolean;
  public status:string;


  constructor(
    private _router:Router,
    private _route:ActivatedRoute,
    private _taskService:TaskService,
    private _userService:UserService,
    private _memberService:MemberService
  ) {
    this.token = this._userService.getToken();
    this.url = Global.url;
    this.member = this._memberService.getMember();
  }

  ngOnInit(): void {
    this._route.params.subscribe(params=>{
      let task_id = params.id;
      this.getTask(task_id);
      
    });
  }

  getTask(task_id){
    this._taskService.task(task_id,this.token).subscribe(
      response => {
        if(response.status == 'success'){
          this.task = response.task;
          if(this.member){
            this.checkAnswer(response.task.answers);
            console.log(this.condition)
          }          
        }else{
          this._router.navigate(['/error']);
        }
      },
      error => {
        this._router.navigate(['/error']);
      }
    );
  }
 
  checkAnswer(answers:Array<any>){
    this.condition = false;
    answers.forEach(answer => {
      if(answer.member_id == this.member.id && answer.task_id == this.task.id){
        this.condition = true;
      } 
    });
    return this.condition;
  }

}

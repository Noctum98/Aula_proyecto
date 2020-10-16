import { Component, OnInit, DoCheck } from '@angular/core';
import { ClassroomService } from '../../services/classroom.service';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers:[ClassroomService,UserService]
})
export class IndexComponent implements OnInit,DoCheck {
  public token:string;
  public classrooms:any;
  public class_members:any;
  public url:string;

  constructor(
    private _classroomService:ClassroomService,
    private _userService:UserService
  ) { 
    this.token = this._userService.getToken();
    this.url = Global.url;
  }

  ngOnInit(): void {
    sessionStorage.removeItem('class');
    sessionStorage.removeItem('member');
    this.getClassrooms();
    this.getClassByMember();
  }

  getClassrooms(){
    this._classroomService.classrooms(this.token).subscribe(
      response =>{
        let values = Object.values(response.classrooms);
        if(response.status == 'success' && response.classrooms.length != 0){
          this.classrooms = response.classrooms;
        }else{
          this.classrooms = 'empty';
        }    
      },
      error =>{
        console.log(<any>error);
      }
    );
  }
  getClassByMember(){
    this._classroomService.classroomsMember(this.token).subscribe(
      response => {
        if(response.status == 'success'  && response.classrooms.length != 0){
          this.class_members = response.classrooms;
        }else{
          this.class_members = 'empty';
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  ngDoCheck(){
    
  }

}

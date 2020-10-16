import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { Global } from './services/global';
import { UserService } from './services/user.service';
import { MemberService } from './services/member.service';
import { Member } from './models/member';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[UserService,MemberService]
})
export class AppComponent implements OnInit,DoCheck{
  title = 'front-aula';
  public user:any;
  public token:string;
  public url:string;
  public code:string;
  public status:string;
  public member:Member

  constructor(
    private _userService:UserService,
    private _memberService:MemberService,
    private _router:Router
  ){
    this.code = "";
    this.user = this._userService.getUser();
    this.token = this._userService.getToken();
    this.url = Global.url;
    if(this.user){
      this.member = new Member(1,this.user.sub,"","","");
    }
    this.status = "normal";
  }

  ngOnInit(){
    console.log(this.user);
  }
  ngDoCheck(){
    this.user = this._userService.getUser();
    this.token = this._userService.getToken();
  }

  logout(){
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('identified');
    sessionStorage.removeItem('class');

    this._router.navigate(['login']);
  }
  onSubmit(form){
    this._memberService.store(this.member,this.code,this.token).subscribe(
      response => {
        if(response.status == 'success'){
          this.status = "success";
          this._router.navigate(['/detail-class',response.member.classroom_id]);
          form.reset();
        }else{
          this.status = "failed";
          form.reset();
        } 
      },
      error => {
        console.log(<any>error);
      }
    );
  }

}

import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user:User;
  public token:string;
  public status:string;
  public userIdentefied:any;

  constructor(
    private _userService:UserService,
    private _router:Router
  ) {
    this.user = new User(1,"","","","","","","","");
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._userService.login(this.user).subscribe(
      response => {
        if(response.code == 200){         
          this.token = response.data;
          // Recogo los datos de el usuario identificado
          this._userService.login(this.user,true).subscribe(
            response => {
              if(response.code == 200){
                localStorage.setItem('TOKEN',this.token);
                localStorage.setItem('identified',JSON.stringify(response.data));
                this._router.navigate(['index']);
              }else{
                this.status = 'failed';
              }
            },
            error => {
              console.log(<any>error);
            }
          );
        }else{
          this.status = 'failed';
        }
      },
      error => {
        this.status = 'failed';
        console.log(<any>error);
      }
    );
  }

}

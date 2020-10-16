import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';
import { User } from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[UserService]
})
export class RegisterComponent implements OnInit {
  public user:User;
  public confirm:string;
  public status:string;
  public afuConfig:Object;
  public resetVar:boolean;
  public url:string;

  constructor(
    private _userService:UserService
  ) {
    this.user = new User(1,"","","","","","","","");
    this.url = Global.url;
    //COnfiguración de subida de imágenes
    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg,.jpeg,.png",
      maxSize: "20",
      uploadAPI:  {
        url:this.url + 'user/upload',
        method:"POST",
      },
      theme: "attachPin",
      hideProgressBar: true,
      hideResetBtn: true,
      hideSelectBtn: false,
      fileNameIndex: true,
      replaceTexts:{
        attachPinBtn:'Pulsa aqui para seleccionar una imágen'
      }
    }
    this.resetVar = true;
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this._userService.register(this.user).subscribe(
      response => {
        this.status = 'success';
        console.log(response);
      },
      error => {
        this.status = 'failed';
        console.log(<any>error);
      }
    );
  }
  upload(data): void{
    let response = data.body;
    this.user.image = response.image;
  }
  

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Global } from '../../services/global';
import { ClassroomService } from '../../services/classroom.service';
import { UserService } from '../../services/user.service';
import { Classroom } from '../../models/classroom';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.css'],
  providers: [ClassroomService,UserService]
})
export class CreateClassComponent implements OnInit {
  public classroom:Classroom;
  public token:string;
  public user:any;
  public url:string;
  public status:string;
  public afuConfig:Object;
  public resetVar:boolean;

  constructor(
    private _classroomService:ClassroomService,
    private _userService:UserService,
    private _router:Router
  ) {
    this.token = this._userService.getToken();
    this.user = this._userService.getUser();
    this.classroom = new Classroom(1,this.user.sub,"","","","","");
    this.url = Global.url;

    //COnfiguración de subida de imágenes
    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".jpg,.jpeg,.png",
      maxSize: "20",
      uploadAPI:  {
        url:this.url + 'classroom/upload',
        method:"POST",
        headers: {
          "Authorization" : this.token
        }
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
    this._classroomService.store(this.token,this.classroom).subscribe(
      response => {
        if(response.status == 'success'){
          this._router.navigate(['index']);
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

  upload(data): void{
    let response = data.body;
    console.log(response);
    this.classroom.image = response.image;
  }
  
}

import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AnswerService } from '../../services/answer.service';
import { MemberService } from '../../services/member.service';
import { ClassroomService } from '../../services/classroom.service';
import { Global } from '../../services/global';
import { Answer } from '../../models/answer';
import { Member } from 'src/app/models/member';

@Component({
  selector: 'answer',
  templateUrl: './answer.component.html',
  styleUrls: ['./answer.component.css'],
  providers:[UserService,AnswerService,MemberService,ClassroomService]
})
export class AnswerComponent implements OnInit {
  public answer:Answer;
  @Input() task;
  @Input() classroom_id;
  public member:Member;
  public token:string;
  public url:string;
  public status:string;
  public control:boolean;
  public options:Object;
  public afuConfig:Object;
  public resetVar:boolean;

  constructor(
    private _userService:UserService,
    private _answerService:AnswerService,
    private _memberService:MemberService,
  ){
    this.control = false;
    this.member = this._memberService.getMember();
    this.url = Global.url;
    this.token = this._userService.getToken();
    this.answer = new Answer(1,1,this.member.id,'','','','');

    this.options = {
      language : 'es',
      toolbarBottom: true,
      placeholderText : "Escribe el contenido de tu respuesta",
      charCounterCount: true,
      toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat'],
      toolbarButtonsXS: ['bold', 'italic', 'underline', 'paragraphFormat'],
      toolbarButtonsSM: ['bold', 'italic', 'underline', 'paragraphFormat'],
      toolbarButtonsMD: ['bold', 'italic', 'underline', 'paragraphFormat'],
    };

    //COnfiguración de subida de imágenes
    this.afuConfig = {
      multiple: false,
      formatsAllowed: ".pdf,.doc,.docx,.odp,.txt",
      maxSize: "20",
      uploadAPI:  {
        url:this.url + 'answer/file',
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
        attachPinBtn:'Pulsa aqui para seleccionar un archivo'
      }
    }
    this.resetVar = true;
  }

  ngOnInit(): void {
  }

  onSubmit(form){
    this.answer.task_id = this.task.id;
    this._answerService.store(this.answer,this.classroom_id,this.token).subscribe(
      response => {
        if(response.status == 'success'){
          this.status = 'success';
          console.log(this.status);
          form.reset();
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  upload(data){
    console.log(data);
    let response = data.body;
    this.answer.file = response.file;
    console.log(this.answer.file);
  }
  changeControl(){
    if(this.control == false){
      this.control = true;
    }else{
      this.control = false;
    }
  }
}

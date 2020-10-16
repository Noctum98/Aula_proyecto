import { Component, OnInit } from '@angular/core';
import { ClassroomService } from '../../services/classroom.service';
import { UserService } from '../../services/user.service';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { Global } from '../../services/global';
import { Classroom } from 'src/app/models/classroom';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
  providers:[ClassroomService,UserService,TaskService]
})
export class CreateTaskComponent implements OnInit {
  public classroom:Classroom;
  public task:Task;
  public token:string;
  public url:string;
  public options:Object;
  public afuConfig:Object;
  public resetVar:boolean;

  constructor(
    private _classroomService:ClassroomService,
    private _userService:UserService,
    private _taskService:TaskService,
    private _router:Router
  ){
    this.classroom = this._classroomService.getClassroom();
    this.token = this._userService.getToken();
    this.task = new Task(1,this.classroom.id,"","","","","","");
    this.url = Global.url;
    this.options = {
      language : 'es',
      toolbarBottom: true,
      placeholderText : "Escribe el contenido de tu tarea",
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
        url:this.url + 'task/file',
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
    this.task.description = this.task.content.substring(509,700);
    this._taskService.store(this.classroom.id,this.task,this.token).subscribe(
      response => {
        if(response.status == 'success'){
          this._router.navigate(['/detail-class',this.classroom.id]);
        }else{
          console.log('No se pudo subir la tarea');
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
  upload(data): void{
    let response = data.body;
    this.task.file = response.file;
  }

}

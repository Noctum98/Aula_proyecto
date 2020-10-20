import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AnswerService } from '../../services/answer.service';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.css'],
  providers:[AnswerService,UserService]
})
export class AnswersComponent implements OnInit {
  public token:string;
  public answers:Array<any>;
  public message:string;

  constructor(
    private _route:ActivatedRoute,
    private _answerService:AnswerService,
    private _userService:UserService
  ) {
    this.token = this._userService.getToken();
  }

  ngOnInit(): void {
    this._route.params.subscribe(params =>{
      let task_id = params.task_id;
      this.getAnswers(task_id);
    });
  }

  getAnswers(task_id){
    this._answerService.answers(task_id,this.token).subscribe(
      response => {
        if(response.status == 'success'){
          this.answers = response.answers;
          if(response.message){
            this.message = response.message;
          }
        }else{
          console.log("Ocurrio un error");
        }
      },
      error => {
        this.router.navigate(['/error']);
      }
    );
  }

}

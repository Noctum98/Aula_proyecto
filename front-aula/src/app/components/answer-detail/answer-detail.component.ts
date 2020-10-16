import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Answer } from 'src/app/models/answer';
import { AnswerService } from '../../services/answer.service';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';

@Component({
  selector: 'app-answer-detail',
  templateUrl: './answer-detail.component.html',
  styleUrls: ['./answer-detail.component.css'],
  providers:[AnswerService,UserService]
})
export class AnswerDetailComponent implements OnInit {
  public token:string;
  public answer:Answer;
  public url:string;

  constructor(
    private _route:ActivatedRoute,
    private _answerService:AnswerService,
    private _userService:UserService
  ) { 
    this.token = this._userService.getToken();
    this.url = Global.url;
  }

  ngOnInit(): void {
    this._route.params.subscribe(params=>{
      let answer_id = params.answer_id;
      this.getAnswer(answer_id);
      
    });
  }

  getAnswer(answer_id){
    this._answerService.answer(answer_id,this.token).subscribe(
      response => {
        if(response.status == 'success'){
          this.answer = response.answer[0];
          console.log(this.answer);
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }
}

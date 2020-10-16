import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Answer } from '../models/answer';

@Injectable()
export class AnswerService{
    public url:string;

    constructor(
        private _http:HttpClient
    ) {
        this.url = Global.url;
    }
    answer(answer_id,token:string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization',token);

        return this._http.get(this.url + 'answer/detail/' + answer_id,{headers:headers});
    }
    answers(task_id,token:string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization',token);

        return this._http.get(this.url + 'answer/task/'+ task_id,{headers:headers});
    }
    store(answer:Answer,classroom_id,token:string): Observable<any>{
        let json = JSON.stringify(answer);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                       .set('Authorization',token);
        return this._http.post(this.url + 'answer/store/'+ classroom_id,params,{headers:headers});
    }
}
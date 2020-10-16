import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Task } from '../models/task';

@Injectable()
export class TaskService{
    public url:string;

    constructor(
        private _http:HttpClient
    ) {
        this.url = Global.url;
    }

    task(task_id,token:string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                       .set('Authorization',token);
        return this._http.get(this.url + 'task/' + task_id,{headers:headers});
    }
    tasks(classroom_id,token): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                       .set('Authorization',token);
        return this._http.get(this.url + 'task/classroom/' + classroom_id,{headers:headers});
    }
    store(classroom_id,task:Task,token): Observable<any>{
        let json = JSON.stringify(task);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                       .set('Authorization',token);
        return this._http.post(this.url + 'task/store/' + classroom_id,params,{headers:headers});
    }
}
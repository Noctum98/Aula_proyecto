import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Classroom } from '../models/classroom';

@Injectable()
export class ClassroomService{
    public url:string;
    public classroom:any;

    constructor(
        private _http:HttpClient
    ){
        this.url = Global.url;
    }

    classrooms(token:string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                       .set('Authorization',token);
        return this._http.get(this.url + 'classroom/user/byUser',{headers:headers});       
    }
    classroomsMember(token:string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                       .set('Authorization',token);
        return this._http.get(this.url + 'classroom/member/byMember',{headers:headers});
    }
    store(token:string,classroom:Classroom): Observable<any>{
        let json = JSON.stringify(classroom);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                       .set('Authorization',token);
        return this._http.post(this.url + 'classroom',params,{headers:headers});
    }
    detail(id,token:string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')
                                       .set('Authorization',token);
        return this._http.get(this.url + 'classroom/' + id,{headers:headers});
    }
    getClassroom(){
        let classroom = JSON.parse(sessionStorage.getItem('class'));

        if(classroom && classroom != 'undefined'){
            this.classroom = classroom;
        }else{
            this.classroom = null;
        }

        return this.classroom;
    }
}
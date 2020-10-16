import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Global } from './global';
import { Member } from '../models/member';

@Injectable()
export class MemberService{
    public url:string;
    public member:any;
    
    constructor(
        private _http:HttpClient
    ) {
        this.url = Global.url;
    }

    members(classroom_id,token:string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization',token);

        return this._http.get(this.url + 'member/classroom/' + classroom_id,{headers:headers});
    }
    Member(classroom_id,token): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization',token);

        return this._http.get(this.url + 'member/user/' + classroom_id,{headers:headers});
    }
    
    store(member:Member,code:any,token): Observable<any>{
        let json = JSON.stringify(member);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization',token);

        return this._http.post(this.url + 'member/store/' + code,params,{headers:headers});
    }
    setRole(member:Member,id,token:string): Observable<any>{
        let json = JSON.stringify(member);
        let params = 'json=' + json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization',token);

        return this._http.put(this.url + 'member/role/' + id,params,{headers:headers});
    }
    getMember(){
        let member = JSON.parse(sessionStorage.getItem('member'));

        if(member && member != 'undefined'){
            this.member = member;
        }else{
            this.member = null;
        }

        return this.member;
    }
    
}
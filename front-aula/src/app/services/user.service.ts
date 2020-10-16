import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { Global } from './global';

@Injectable()
export class UserService {
    public url:string;
    public user:any;
    public token:string;

    constructor(
        private _http:HttpClient
    ){
        this.url = Global.url;
    }

    register(user:User):Observable<any>{
        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        return this._http.post(this.url + 'user/register',params,{headers:headers});
    }

    login(user:User,getToken = false): Observable<any>{
        if(getToken){
            user.remember_token = 'GET_TOKEN';
        }

        let json = JSON.stringify(user);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

        return this._http.post(this.url + 'user/login',params,{headers:headers});
    }
    getUser(){
        let user = JSON.parse(localStorage.getItem('identified'));

        if(user && user != 'undefined'){
            this.user = user;
        }else{
            this.user = null;
        }

        return this.user;
    }
    getToken(){
        let token = localStorage.getItem('TOKEN');

        if(token && token != 'undefined'){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }
}
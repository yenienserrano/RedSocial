import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
import { Global } from './global';

@Injectable()

export class UserService{
    public url: string;
    public identity:string;
    public token: string;
    

    constructor(
        private _http: HttpClient
    ){
        this.url = Global.url;
    }

    register(user: User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-type', 'application/json');

        return this._http.post(this.url+"register", params, {headers: headers})
    }

    signup(user: User, gettoken = null): Observable<any>{
        if(gettoken != null){
            user.gettoken = gettoken;
        }
        
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-type', 'application/json');
        
        return this._http.post(this.url+"login", params, {headers: headers})
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity != "undefined"){
            this.identity = identity
        }else{
            this.identity = null
        }
        return this.identity;
    }

    getToken(){
        let token = localStorage.getItem('token');

        if(token != "undefined"){
            this.token = token
        }else{
            this.token = null
        }
        return this.token
    }

    getStats(){
        let stats = JSON.parse(localStorage.getItem('stats'));

        if(stats != "undefined"){
            stats = stats;
        }else{
            stats = null
        }
        return stats
    }

    getCounters(userId = null): Observable<any>{
        var headers = new HttpHeaders().set('Content-Type', "application/jsom")
                                       .set('Authorization', this.getToken());
        if(userId != null){
            return this._http.get(this.url+"counters/"+userId, {headers: headers})
        }else{
            return this._http.get(this.url+"counters", {headers: headers})
        }                                        
    }    
    
    updateUser(user: User): Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', "application/jsom")
                                       .set('Authorization', this.getToken());
        
        return this._http.put(this.url+'update-user/'+user._id, params, {headers: headers});                                        
    }
}
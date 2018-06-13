import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Player } from '../models/player';
import { ToastController } from 'ionic-angular';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

@Injectable()
export class UsersService {

    endpoint: string;
    headers: any;
    currentUserId: number;
    private role: string;    
    player: Player;

    constructor(private http: HttpClient, public toastCtrl: ToastController) {
        this.endpoint = 'http://tippserver.ddns.net:8080';
        this.headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });
            this.currentUserId = -1;
    }

    loginUser(name: string, password: string): Observable<boolean>{
        let post_data = {name: name, password: password};
        return this.http.post<any>(this.endpoint + '/login', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {;
            let success: boolean = JSON.parse(response.loggedIn);
           if(success){
                this.currentUserId = response.userId;
                this.role = response.role;
                return true;
           } else {
                const toast = this.toastCtrl.create({
                    message: 'Name und Password stimmen nicht überein',
                    position: 'middle',
                    duration: 3000
                });
                toast.present();
                return false;
           }
        }).pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        return Observable.throw('Keine Netzwerkverbindung');
      };

    getNameOfUser(userId: number): Observable<string> {
        let post_data = {userId: userId};
        return this.http.post<any>(this.endpoint + '/userName', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
           return response.name;
        });
    }

    registerUser(name: string, password: string): Observable<boolean> {
        let post_data = {name: name, password: password};
        return this.http.post<any>(this.endpoint + '/insertUser', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            let success: boolean = JSON.parse(response.registered);
           if(success){
                this.currentUserId = response.userId;
                this.role = response.role;
                return true;
           } else {
               if(response.reason == 'inUse'){
                 const toast = this.toastCtrl.create({
                        message: 'Benutzer existiert bereits',
                        position: 'middle',
                        duration: 3000
                    });
                    toast.present();
               }
                return false;
           }
        });
    }

    insertTippUser(userId: number, tippspielId: number): Observable<boolean> {
        let post_data = {userId: userId, tippspielId: tippspielId};
        return this.http.post<any>(this.endpoint + "/insertTippUser", JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
       .map((response) => {
            if(response.inserted) {
                return true;
            } else {
                return false;
            }
        });
    }

    getCurrentUserId(): number {
        return this.currentUserId;
    }

    setCurrentUserId(userId: number) {
        this.currentUserId = userId;
    }

    getUserRole(): string {
        return this.role;
    }

    setUserRole(userRole: string) {
        this.role = userRole;
    }

    getTippspielUser(tippspielId: number): Observable<Player> {
        let post_data = {userId: this.currentUserId, tippspielId: tippspielId};
        return this.http.post<any>(this.endpoint + "/tippspielUserById", JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
       .map((response) => {
           return new Player(response.id, response.userid, response.tippspielid, response.points);
        });
    }

    getAllTippspielUserById(tippspielId: number): Observable<Player[]> {
        let post_data = {tippspielId: tippspielId};
        return this.http.post<any>(this.endpoint + "/tippspielUsers", JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
       .map((response) => {
           let players: Player[] = [];
           response.forEach(player => {
               players.push(new Player(player.id, player.userid, player.tippspielid, player.points));
           });
           return players;
        });

    }

    
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import TippGame from '../models/tippgame';
import { Tipp } from '../models/tipp';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class TippService {

    endpoint: string;
    headers: any;
    tippGame: TippGame;

    constructor(private nativeStorage: NativeStorage, private http: HttpClient) {
        this.endpoint = 'http://tippserver.ddns.net:8080';
        this.headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });
    }

    insertTipp(gameId: number, userId: number,  goalsHome: number, goalsGuest: number): Observable<boolean> {
        let post_data = {gameId: gameId, userId: userId, goalsHome: goalsHome, goalsGuest: goalsGuest};
       return this.http.post<any>(this.endpoint + '/insertTipp', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            if(response.inserted) {
                return true;
            } else {
                return false;
            }
        });
    }

    insertTippspiel(name: string): Observable<boolean> {
        let post_data = {name: name};
        return this.http.post<any>(this.endpoint + '/insertTippspiel', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            if(response.inserted) {
                return true;
            } else {
                return false;
            }
        });
    }

    loadTippGame(id: number): void {
        /**this.getTippGameById(id).subscribe((game: TippGame) => {
            this.tippGame = game;
        });**/
        this.tippGame = new TippGame(1, "Family & Friends");
    }

    getTippGameById(id:number): Observable<TippGame> {
        let post_data = {id: id};
        return this.http.post<any>(this.endpoint + '/tippspielById', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            return new TippGame(response.id, response.name);
        });
    }

    getTippById(userId: number, gameId: number): Observable<Tipp> {
        let post_data = {userId: userId, gameId: gameId};
        return this.http.post<any>(this.endpoint + '/tippById', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            if(response.exists) {
                return new Tipp(response.id, response.spielid, response.userid, response.goalshome, response.goalsguest);
            } else {
                return new Tipp(-1, gameId, userId, 0, 0);
            }
        });
    }

    getTippsByUser(userId: number): Observable<Tipp[]> {
        let post_data = {userId: userId};
        return this.http.post<any>(this.endpoint + '/tippsByUser', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            let tipps: Tipp[] = [];
            response.forEach(tipp => {
                tipps.push(new Tipp(tipp.id, tipp.spielid, tipp.userid, tipp.goalshome, tipp.goalsguest));
            });
            return tipps;
        });
    }

    updateTipp(id: number, goalsHome: number, goalsGuest: number): Observable<boolean> {
        let post_data = {id: id, goalsHome: goalsHome, goalsGuest: goalsGuest};
        return this.http.post<any>(this.endpoint + '/updateTipp', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            if(response.updated) {
                return true;
            } else {
                return false;
            }
        });
    }

    initTipps(playerId: number): Observable<boolean> {
        let post_data = {id: playerId};
        return this.http.post<any>(this.endpoint + '/initTipps', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            if(response.inserted) {
                return true;
            } else {
                return false;
            }
        });
    }

    getCurrentTippGame(): TippGame {
        return this.tippGame;
    }

    setTippGame(tippGame: TippGame) {
        this.tippGame = tippGame;
    }

    storeTipps(userId: number) {
        this.getTippsByUser(userId).subscribe((tipps: Tipp[]) => {
            this.nativeStorage.setItem('tipps', JSON.stringify(tipps)).then(
                () => {
                    console.log("Tipps stored");
                }, 
                err => {
                    console.log("storing failed");
                }
            )
        },
    err => {
        console.log("no connection for storing tipps");
    });
    }

    loadTippFromStorage(userId: number, gameId: number){
        return new Promise(resolve => {
            this.nativeStorage.getItem('tipps').then(
                (tipps) => {
                    let json = JSON.parse(tipps);
                    json.forEach((element) => {
                        if(element.gameId == gameId && element.playerId == userId){
                            resolve(new Tipp(element.id, element.gameId, element.playerId, element.goalsHome, element.goalsGuest));
                        }
                    });
                }
            );
        });
    }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Game } from '../models/game';
import { TeamService } from './team.service';
import { Team } from '../models/team';
import { Subscription } from 'rxjs/Subscription';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class GameService {

    endpoint: string;
    httpOptions: any;
    home: Team;
    guest: Team;
    homeId: number;
    guestId: number;
    games: Game[];


    constructor(private nativeStorage: NativeStorage, private http: HttpClient, private teamService: TeamService) {
        this.endpoint = 'http://tippserver.ddns.net:8080';
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        this.games = [];
    }

    private loadGames(): Observable<Game[]> {
       return this.http.get<any>(this.endpoint + '/games').map((response) => {
           let games: Game[] = [];
           response.forEach(game => {
                games.push(
                    new Game(game.id,
                    new Team(game.homeTeam.id, game.homeTeam.name, game.homeTeam.flag, game.homeTeam.gruppe),
                    new Team(game.guestTeam.id, game.guestTeam.name, game.guestTeam.flag, game.guestTeam.gruppe),
                game.goalshome, game.goalsguest, new Date(game.date)));
           });
           //this.storeGames(games);
           return games;
       });
    }

    getGames() {
        return new Promise(resolve => {
            if(this.games.length > 0) {
                resolve(this.games);
            } else {
                this.loadGames().subscribe((games: Game[]) => {
                    for(let i = 0; i < games.length; i++) {
                        games[i].getHome().setFlag("flag-icon-" + games[i].getHome().getFlag());
                        games[i].getGuest().setFlag("flag-icon-" + games[i].getGuest().getFlag());
                        this.games.push(games[i]);
                        if(i == games.length -1) {
                            resolve(this.games);
                        }
                    }
                });
            }

        });
    }

    storeGames(games: Game[]) {
        this.nativeStorage.setItem('games', JSON.stringify(games)).then(
            () => {
                console.log("storing games");
            },
            err => {

            }
        )
    }

    getStoredGames() {
       return new Promise((resolve) => {
        let games: Game[] = [];
        this.nativeStorage.getItem('games').then(
            (data) => {
                let json = JSON.parse(data);
                for(let i = 0; i < json.length; i++) {
                    games.push(new Game(json[i].id, new Team(json[i].home.id, json[i].home.name, json[i].home.flag, json[i].home.gruppe), new Team(json[i].guest.id, json[i].guest.name, json[i].guest.flag, json[i].guest.gruppe), json[i].goalsHome, json[i].goalsGuest, new Date(json[i].date)));
                    if(i == json.length -1){
                        resolve(games);
                    }
                }
            }
        );
       });
    }

    insertGame(homeId: number, guestId: number, goalsHome: number, goalsGuest: number, date: Date) {
        let post_data = {homeId : homeId, guestId: guestId, goalsHome: goalsHome, goalsGuest: goalsGuest, date: date};
        this.http.post(this.endpoint + '/insertGame', JSON.stringify(post_data), this.httpOptions)
        .subscribe((response) => {
            console.log(response);
        });
    }

    updateGame(id: number, goalsHome: number, goalsGuest: number): Observable<boolean> {
        let post_data = {id: id, goalsHome: goalsHome, goalsGuest: goalsGuest};
        return this.http.post<any>(this.endpoint + '/updateGame', JSON.stringify(post_data), {headers: this.httpOptions.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            console.log(response.updated);
            if(response.updated){
                return true;
            } else {
                return false;
            }
        });
    }

    getGameById(id: number): Observable<Game>{
        let post_data = {gameId: id};
        let options = this.httpOptions;
        options.responseType = 'json';
        return this.http.post<any>(this.endpoint + '/gameById', JSON.stringify(post_data), {headers: this.httpOptions.headers, observe: 'body', responseType: 'json'})
        .map((response) => {
            return new Game(response.id, new Team(
                response.homeTeam.id,
                response.homeTeam.name,
                response.homeTeam.flag,
                response.homeTeam.gruppe),
                new Team(response.guestTeam.id,
                    response.guestTeam.name,
                    response.guestTeam.flag,
                    response.guestTeam.gruppe),
                response.goalshome, response.goalsguest, new Date(response.date));  
        });
    }

}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Team } from '../models/team';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class TeamService {

    endpoint: string;
    headers: any;

    constructor(private http: HttpClient) {
        this.endpoint = 'http://tippserver.ddns.net:8080';
        this.headers = new HttpHeaders({
                'Content-Type': 'application/json'
            });
    }

    getTeams(): Observable<Team[]> {
        return this.http.get<any[]>(this.endpoint + '/teams').map((response) => {
            let teams: Team[] = [];
            response.forEach(team => {
                teams.push(new Team(team.id, team.name, team.flag, team.gruppe));
            });
            return teams;
        });
    }

    insertTeam(name: string, flag: string, group: string) {
        let post_data = {name: name, flag: flag, gruppe: group};
        this.http.post(this.endpoint + '/insertTeam', JSON.stringify(post_data), {headers: this.headers}).subscribe((response) => {
            console.log(response);
        });
    }

    getTeamById(id: number): Observable<Team> {
        let post_data = {teamId: id};
        return this.http.post<any>(this.endpoint + '/teamById', JSON.stringify(post_data), {headers: this.headers, observe: 'body', responseType: 'json'}).map((response) => {
            return new Team(response.id, response.name, response.flag, response.gruppe);
        });
    }

}
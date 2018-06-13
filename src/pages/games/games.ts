import { Component } from "@angular/core";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { GameDetailPage } from "../gameDetail/gameDetail";
import { Game } from "../../models/game";

import { TeamService } from "../../services/team.service";
import { Team } from "../../models/team";
import { GameService } from "../../services/games.service";

@Component({
    selector: 'game-list',
    templateUrl: 'games.html'
})
export class GamesPage {
    selectedItem: any;
    games: Game[];
    dates: {date: Date, games: Game[]}[];
    currentDate: number

    constructor(public navCtrl: NavController, public navParams: NavParams, private teamService: TeamService, private gameService: GameService) {
        this.games = [];
        this.dates = [];
        this.loadGames();
        console.log(this.dates);
        this.currentDate = Date.now();
    }

    gameChoosed(event, game){
        this.navCtrl.push(GameDetailPage, {game: game});
    }

    loadGames() {
        this.gameService.getGames().then((games: Game[]) => {
            games.forEach((game: Game) => {
                let dateString: Date = new Date(game.getDate().toDateString());
                let found: boolean = false;
                this.dates.forEach((bundle:{date: Date, games: Game[]}) => {
                    if(bundle.date.valueOf() == dateString.valueOf()){
                        bundle.games.push(game);
                        found = true;
                    }
                });
                if(!found){
                    let gameArray: Game[] = [];
                    gameArray.push(game);
                    this.dates.push({date: dateString, games: gameArray});
                }
                found = false;
                this.games.push(game);
            });
        });
        /**this.gameService.getGames().subscribe((games: Game[]) => {
            games.forEach((game: Game) => {
                console.log(game.getDate().toDateString());
                let dateString: Date = new Date(game.getDate().toDateString());
                let found: boolean = false;
                this.dates.forEach((bundle:{date: Date, games: Game[]}) => {
                    if(bundle.date.valueOf() == dateString.valueOf()){
                        bundle.games.push(game);
                        found = true;
                    }
                });
                if(!found){
                    let gameArray: Game[] = [];
                    gameArray.push(game);
                    this.dates.push({date: dateString, games: gameArray});
                }
                found = false;
                game.getHome().setFlag("flag-icon-" + game.getHome().getFlag());
                game.getGuest().setFlag("flag-icon-" + game.getGuest().getFlag());
                this.games.push(game);
            });
        }, error => {
            this.gameService.getStoredGames().then((games: Game[]) => {
                console.log(games.length);
                games.forEach((game: Game) => {
                    console.log(game.getDate().toDateString());
                    let dateString: Date = new Date(game.getDate().toDateString());
                    let found: boolean = false;
                    this.dates.forEach((bundle:{date: Date, games: Game[]}) => {
                        if(bundle.date.valueOf() == dateString.valueOf()){
                            bundle.games.push(game);
                            found = true;
                        }
                    });
                    if(!found){
                        let gameArray: Game[] = [];
                        gameArray.push(game);
                        this.dates.push({date: dateString, games: gameArray});
                    }
                    found = false;
                    game.getHome().setFlag("flag-icon-" + game.getHome().getFlag());
                    game.getGuest().setFlag("flag-icon-" + game.getGuest().getFlag());
                    this.games.push(game);
                });
            });
               
        });**/
    }
}
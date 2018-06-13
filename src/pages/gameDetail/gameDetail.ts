import { Component } from "@angular/core";
import { Game } from "../../models/game";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { ModalController } from 'ionic-angular';
import { TippGamePage } from "../tippGame/tippGame";
import { TippService } from "../../services/tipp.service";
import { UsersService } from "../../services/users.service";
import { Player } from "../../models/player";
import { Tipp } from "../../models/tipp";
import { GameService } from "../../services/games.service";


@Component({
    selector: 'game-detail',
    templateUrl: "gameDetail.html"
})
export class GameDetailPage {
    game: Game;
    tippMode: boolean;
    admin: boolean;
    tippBtnName: string;
    editBtnName: string;
    homeGoals: number = 0;
    guestGoals: number = 0;
    player: Player;
    tipp: Tipp;
    started: boolean;
    playerTipps: {name: string, tipp: Tipp}[];
    currentDate: number;

    constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private tippService: TippService, private userService: UsersService, private gameService: GameService) {
        this.currentDate = Date.now().valueOf();
        this.game = navParams.get('game');
        this.tippMode = false;
        this.tippBtnName = "Tippen";
        this.editBtnName = "Bearbeiten";
        if(this.userService.getUserRole() == "admin"){
            this.admin = true;
        } else {
            this.admin = false;
        }
        this.userService.getTippspielUser(this.tippService.getCurrentTippGame().getId()).subscribe((player: Player) => {
            this.player = player;
            if(this.game.getDate().valueOf() > Date.now() ){
                this.tippService.getTippById(this.player.getId(), this.game.getId()).subscribe((tipp: Tipp) => {
                    this.tipp = tipp;
                    this.homeGoals = this.tipp.getGoalsHome();
                    this.guestGoals = this.tipp.getGoalsGuest();
                    /**if(this.tipp.getId() < 0) {
                        this.tippService.insertTipp(this.game.getId(), this.player.getId(), 0, 0).subscribe((success: boolean) => {
                            this.tippService.getTippById(this.player.getId(), this.game.getId()).subscribe((tippRes: Tipp) => {
                                this.tipp = tippRes;
                            });
                        });
                    }**/
                }, err => {
                    //this.tippService.loadTippFromStorage(this.userService.get)
                }); 
            } else {
                console.log("game started");
                this.homeGoals = this.game.getGoalsHome();
                this.guestGoals = this.game.getGoalsGuest();
            }
        });
        this.playerTipps = [];
        this.checkLoadTipps();
        console.log(this.playerTipps);
    }

    openTippModal() {
        if(!this.tippMode){
            this.tippBtnName = "OK";
        } else {
            this.tippBtnName = "Tippen";
        }
        this.tippMode = !this.tippMode;
    }

    tippGame() {
        if(!this.tippMode){
            this.tippBtnName = "OK";
        } else {
            console.log(this.tipp.getId());
            this.tippService.updateTipp(this.tipp.getId(), this.homeGoals, this.guestGoals).subscribe((response: boolean) => {
                console.log(response);
            });
            this.tippBtnName = "Tippen";
        }
        this.tippMode = !this.tippMode;
        console.log(this.game);
        console.log(this.player);
    }

    editGame() {
        if(!this.tippMode){
            this.homeGoals = this.game.getGoalsHome();
            this.guestGoals = this.game.getGoalsGuest();
            this.editBtnName = "OK";
        } else {
            this.gameService.updateGame(this.game.getId(), this.homeGoals, this.guestGoals).subscribe((response: boolean) => {
                console.log(response);
            });
            this.editBtnName = "Bearbeiten";
        }
        this.tippMode = !this.tippMode;
    }

    checkLoadTipps() {
        if(this.game.getDate().valueOf() < Date.now()){
            this.started = true;
            this.userService.getAllTippspielUserById(1).subscribe((players: Player[]) => {
                players.forEach((player: Player) => {
                    this.tippService.getTippById(player.getId(), this.game.getId()).subscribe((tipp: Tipp) => {
                        this.userService.getNameOfUser(player.getUserId()).subscribe((name: string) => {
                            this.playerTipps.push({name: name, tipp: tipp});
                        });
                    });
                });
            });
        } else {
            this.started = false;
        }
    }

}
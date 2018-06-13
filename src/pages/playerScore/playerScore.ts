import { Component } from "@angular/core";
import { Player } from "../../models/player";
import { NavController } from "ionic-angular";
import { NavParams } from "ionic-angular";
import { UsersService } from "../../services/users.service";

@Component({
    selector: 'player-table',
    templateUrl: 'playerScore.html'
})
export class PlayerScorePage{
    //players: Player[];
    players: {name: string, player: Player}[];

    constructor(public nacCtrl: NavController, public navParams: NavParams, private userService: UsersService) {
        this.players = [];
        this.loadPlayers();
    }

    playerClicked(event, player){

    }

    loadPlayers(): void {
        this.userService.getAllTippspielUserById(1).subscribe((players: Player[]) => {
            for(let i = 0; i < players.length; i++) {
                this.players.push({name: "", player: players[i]});
                if(i == players.length -1) {
                    this.players.forEach((player: {name:string, player: Player}) => {
                        this.userService.getNameOfUser(player.player.getUserId()).subscribe((name: string) => {
                            player.name = name;
                        });
                    });
                }
            }
        });
    }

    sortPlayers() {
        for(let i = 0; i < this.players.length; i++) {
            for(let j = 0; j < this.players.length; j++){
                if(this.players[i].player.getPoints() > this.players[j].player.getPoints()){
                    this.players.splice(j, 0, this.players[i]);
                    this.players.splice(i, 1);
                }
            }
            
        }
    }
}
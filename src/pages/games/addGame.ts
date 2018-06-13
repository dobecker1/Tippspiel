import { Component } from "@angular/core";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { TeamService } from "../../services/team.service";
import { GameService } from "../../services/games.service";
import { Team } from "../../models/team";
import { ToastController } from 'ionic-angular';




@Component({
    selector: 'addGame',
    templateUrl: 'addGame.html'
})
export class AddGamePage {

    teams: Team[];
    homeTeam: Team;
    guestTeam: Team;
    kickoff: Date;

    constructor(public navCtrl: NavController, public navParams: NavParams, private teamService: TeamService, private gameService: GameService, public toastCtrl: ToastController) {
        this.teams = [];
        this.teamService.getTeams().subscribe((teams: Team[]) => {
            teams.forEach((team: Team) => {
                team.setFlag("flag-icon-" + team.getFlag());;
                this.teams.push(team);
            });
        });
    }

    addGame(event) {
       this.gameService.insertGame(this.homeTeam.getId(), this.guestTeam.getId(), 0, 0, this.kickoff);
       const toast = this.toastCtrl.create({
        message: 'Spiel wurde hinzugefügt',
        position: 'top',
        duration: 3000
      });
      toast.present();
    }

    
}
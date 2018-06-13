import { Component } from "@angular/core";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { TeamService } from "../../services/team.service";
import { ToastController } from 'ionic-angular';



@Component({
    selector: 'addTeams',
    templateUrl: 'addTeams.html'
})
export class AddTeamPage {
    group: string;
    team: string;
    flag: string;

    constructor(public navCtrl: NavController, public navParams: NavParams, private teamService: TeamService, public toastCtrl: ToastController) {
        this.group = "A";
    }

    addTeam(event){
        this.teamService.insertTeam(this.team, this.flag, this.group);
        const toast = this.toastCtrl.create({
            message: 'Team ' + this.team + 'wurde hinzugefügt',
            position: 'top',
            duration: 3000
          });
          toast.present();
          this.flag = '';
          this.team = '';
    }
}
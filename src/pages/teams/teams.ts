import { Component, group } from "@angular/core";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { TeamService } from "../../services/team.service";
import { Team } from "../../models/team";



@Component({
    selector: 'teams',
    templateUrl: 'teams.html'
})
export class TeamsPage {

    groups: {[key: string]: Team[]};
    test: string = 'flag-icon-mx';

    constructor(public navCtrl: NavController, public navParams: NavParams, private teamService: TeamService) {
        this.groups = {};
        this.loadTeams();
        console.log(this.groups);
    }

    loadTeams() {  
        this.teamService.getTeams().subscribe((teamsData: Team[]) => {
            teamsData.forEach((team: Team) => {
                team.setFlag("flag-icon-" + team.getFlag());
                console.log(team.getGruppe());
                if(this.groups[team.getGruppe()] == undefined){
                    this.groups[team.getGruppe()] = [];
                }
                this.groups[team.getGruppe()].push(team);
            });
        });
    }

}
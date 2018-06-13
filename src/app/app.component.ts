import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { GamesPage } from '../pages/games/games';
import { PlayerScorePage } from '../pages/playerScore/playerScore';
import { AddTeamPage } from '../pages/teams/addTeams';
import { TeamsPage } from '../pages/teams/teams';
import { UsersService } from '../services/users.service';
import { AddGamePage } from '../pages/games/addGame';
import { TippService } from '../services/tipp.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { ToastController } from 'ionic-angular';
import TippGame from '../models/tippgame';
import { GameService } from '../services/games.service';
import { Player } from '../models/player';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = GamesPage;

  pages: Array<{title: string, component: any}>;
  loggedinPages: Array<{title: string, component: any}>;
  loggedoutPages: Array<{title: string, component: any}>;
  adminPages: Array<{title: string, component: any}>;
  loggedIn: boolean;
  username: string;
  password: string;
  success: boolean;

  constructor(public toastCtrl: ToastController, private nativeStorage: NativeStorage, public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private userService: UsersService, private tippService: TippService, private gameService: GameService) {
    this.loggedIn = false;
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.loggedoutPages = [
      { title: 'Gruppen', component: TeamsPage}
    ];
    this.loggedinPages = [
      { title: 'Spiele', component: GamesPage },
      { title: 'Gruppen', component: TeamsPage},
      { title: 'Tabelle', component: PlayerScorePage}
    ];
    this.adminPages = [
      { title: 'Spiele', component: GamesPage },
      { title: 'Gruppen', component: TeamsPage},
      { title: 'Tabelle', component: PlayerScorePage},
      { title: "Team hinzufügen", component: AddTeamPage},
      { title: "Spiel hinzufügen", component: AddGamePage}
    ];
    this.pages = this.loggedoutPages;
    if(this.platform.is('android')){
      console.log('is android');
      this.nativeStorage.getItem('loginData').then(
        data => {
          this.userService.setCurrentUserId(data.userId);
          this.userService.setUserRole(data.userRole);
          this.loggedIn = true;
          this.userService.getNameOfUser(data.userId).subscribe((name: string) => {
            this.username = name;
          });
          this.tippService.setTippGame(new TippGame(data.tippgameId, data.tippgameName));
          if(data.userRole == 'admin') {
            this.pages = this.adminPages;
          } else {
            this.pages = this.loggedinPages;
          }
        },
        err => {
          console.log("no user");
        }
      );
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(this.userService.getCurrentUserId() > 0 && this.userService.getUserRole() == 'admin') {
      this.loggedIn = true;
      this.pages = this.adminPages;
    } else if(this.userService.getCurrentUserId() > 0) {
      this.loggedIn = true;
      this.pages = this.loggedinPages;
    } else{
      this.loggedIn = false;
      this.pages = this.loggedoutPages;
    }
    this.nav.setRoot(page.component);
  }

  logout(event) {
    this.loggedIn = false;
  }

  login(event) {
    this.tippService.loadTippGame(1);
    this.userService.loginUser(this.username.trim(), this.password).subscribe((success: boolean) => {
      if(success) {
        if(this.userService.getUserRole() == 'admin'){
          this.pages = this.adminPages;
        } else {
          this.pages = this.loggedinPages;
        }
        this.loggedIn = true;
         //dummy methods
        //store user data
        if(this.platform.is('android')){
          this.nativeStorage.setItem('loginData', {userId: this.userService.getCurrentUserId(), userRole: this.userService.getUserRole(), tippgameId: this.tippService.getCurrentTippGame().getId(), tippgameName: this.tippService.getCurrentTippGame().getName()}).then(
            () => {console.log("Login saved")},
            err => {
      
            }
          );
        }
      } else {

      }
    }, error => {
      console.log("an error occured");
        this.userService.setCurrentUserId(1); //Dummy login
        this.userService.setUserRole('admin');
        this.pages = this.adminPages;
        this.loggedIn = true;
    });
  }

  register(event) {
    this.tippService.loadTippGame(1); //dummy method
    this.userService.registerUser(this.username.trim(), this.password).subscribe((success: boolean) => {
      if(success){
        if(this.userService.getUserRole() == 'admin') {
          this.pages = this.adminPages;
        } else {
          this.pages = this.loggedinPages;
        }
        this.loggedIn = true;
        this.userService.insertTippUser(this.userService.getCurrentUserId(), this.tippService.getCurrentTippGame().getId()).subscribe((success: boolean) => {
          if(success) {
            console.log("TippUser inserted");
            this.userService.getTippspielUser(1).subscribe((player: Player) => {
              this.tippService.initTipps(player.getId()).subscribe((successTipps: boolean) => {
                  console.log(successTipps);
              });
            });
          }
        });
      } else {

      }
    });
  }
}

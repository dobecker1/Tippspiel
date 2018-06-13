import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GamesPage } from '../pages/games/games';
import { GameDetailPage } from '../pages/gameDetail/gameDetail';
import { TippGamePage } from '../pages/tippGame/tippGame';
import { PlayerScorePage } from '../pages/playerScore/playerScore';
import { GameService } from '../services/games.service';
import { TeamService } from '../services/team.service';
import { AddTeamPage } from '../pages/teams/addTeams';
import { UsersService } from '../services/users.service';
import { TeamsPage } from '../pages/teams/teams';
import { AddGamePage } from '../pages/games/addGame';
import { TippService } from '../services/tipp.service';
import { NativeStorage } from '@ionic-native/native-storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    GamesPage,
    GameDetailPage,
    TippGamePage,
    PlayerScorePage,
    AddTeamPage,
    TeamsPage,
    AddGamePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    GamesPage,
    GameDetailPage,
    TippGamePage,
    PlayerScorePage,
    AddTeamPage,
    TeamsPage,
    AddGamePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GameService,
    TeamService,
    UsersService,
    TippService,   
    NativeStorage,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

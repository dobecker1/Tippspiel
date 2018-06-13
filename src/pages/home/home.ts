import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  loggedIn: boolean;
  username: string;
  password: string;

  constructor(public navCtrl: NavController, private userService: UsersService) {
    this.loggedIn = this.userService.getCurrentUserId() > 0;
  }

}

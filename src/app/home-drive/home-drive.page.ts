import { Component, OnInit } from '@angular/core';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home-drive',
  templateUrl: './home-drive.page.html',
  styleUrls: ['./home-drive.page.scss'],
})
export class HomeDrivePage implements OnInit {

  constructor(private Nav: NavController) { }

  ngOnInit() {
  }

  goToInventory(){
    this.Nav.navigateForward("/inventory");
  }

  goToAddUser(){
    this.Nav.navigateForward("/create");
  }

  goToAnalytics(){
    this.Nav.navigateForward("/viewproducts");
  }

  Exit(){
    this.Nav.navigateForward("/sign-in");
  }

}

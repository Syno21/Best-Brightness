import { Component } from '@angular/core';
import {  LoadingController,NavController, ToastController , AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private Nav: NavController,
  ) {}

  goToInventory(){
    this.Nav.navigateForward("/inventory");
  }

  goToAddUser(){
    this.Nav.navigateForward("/create");
  }

  goToAnalytics(){
    this.Nav.navigateForward("/viewproducts");
  }

  goToStockExchange(){
    this.Nav.navigateForward("/deliveries");
  }

  goToAddNewStock(){
    this.Nav.navigateForward("/add");
  }

  Exit(){
    this.Nav.navigateForward("/sign-in");
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewproductsPageRoutingModule } from './viewproducts-routing.module';

import { ViewproductsPage } from './viewproducts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewproductsPageRoutingModule
  ],
  declarations: [ViewproductsPage]
})
export class ViewproductsPageModule {}

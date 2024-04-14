import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomingStockPageRoutingModule } from './incoming-stock-routing.module';

import { IncomingStockPage } from './incoming-stock.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomingStockPageRoutingModule
  ],
  declarations: [IncomingStockPage]
})
export class IncomingStockPageModule {}

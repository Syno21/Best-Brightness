import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeDrivePageRoutingModule } from './home-drive-routing.module';

import { HomeDrivePage } from './home-drive.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeDrivePageRoutingModule
  ],
  declarations: [HomeDrivePage]
})
export class HomeDrivePageModule {}

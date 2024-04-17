import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeDrivePage } from './home-drive.page';

const routes: Routes = [
  {
    path: '',
    component: HomeDrivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeDrivePageRoutingModule {}

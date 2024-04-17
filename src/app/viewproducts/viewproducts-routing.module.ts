import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewproductsPage } from './viewproducts.page';

const routes: Routes = [
  {
    path: '',
    component: ViewproductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewproductsPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomingStockPage } from './incoming-stock.page';

const routes: Routes = [
  {
    path: '',
    component: IncomingStockPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomingStockPageRoutingModule {}

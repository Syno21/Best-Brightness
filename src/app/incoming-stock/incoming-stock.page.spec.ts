import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncomingStockPage } from './incoming-stock.page';

describe('IncomingStockPage', () => {
  let component: IncomingStockPage;
  let fixture: ComponentFixture<IncomingStockPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

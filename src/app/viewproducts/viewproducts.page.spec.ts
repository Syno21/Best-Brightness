import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewproductsPage } from './viewproducts.page';

describe('ViewproductsPage', () => {
  let component: ViewproductsPage;
  let fixture: ComponentFixture<ViewproductsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewproductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

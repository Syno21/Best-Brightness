import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeDrivePage } from './home-drive.page';

describe('HomeDrivePage', () => {
  let component: HomeDrivePage;
  let fixture: ComponentFixture<HomeDrivePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeDrivePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarLoginComponent } from './nav-bar-login.component';

describe('LoginComponent', () => {
  let component: NavbarLoginComponent;
  let fixture: ComponentFixture<NavbarLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarLoginComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavbarLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

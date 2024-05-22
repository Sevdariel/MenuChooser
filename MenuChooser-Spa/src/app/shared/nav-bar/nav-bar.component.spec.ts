import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarComponent } from './nav-bar.component';
import { AccountService } from '../account/account.service';
import { HttpClient } from '@angular/common/http';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let accountService: AccountService;
  let httpClient: HttpClient;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    accountService = TestBed.inject(AccountService)
    httpClient = TestBed.inject(HttpClient)
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

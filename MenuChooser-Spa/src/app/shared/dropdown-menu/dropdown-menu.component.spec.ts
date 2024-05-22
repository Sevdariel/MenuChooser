import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMenuComponent } from './dropdown-menu.component';

describe('DropdownMenuComponent', () => {
  let component: DropdownMenuComponent;
  let fixture: ComponentFixture<DropdownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownMenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownMenuComponent);
    component = fixture.componentInstance;

    component.dropdownSettings = {
      id: 'dropdownId',
    }

    fixture.detectChanges();
  });

  it('should create', () => {
    // expect(component).toBeTruthy();
  });
});

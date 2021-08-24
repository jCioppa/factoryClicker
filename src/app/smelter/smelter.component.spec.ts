import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmelterComponent } from './smelter.component';

describe('SmelterComponent', () => {
  let component: SmelterComponent;
  let fixture: ComponentFixture<SmelterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmelterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmelterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

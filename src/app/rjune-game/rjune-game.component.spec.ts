import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RjuneGameComponent } from './rjune-game.component';

describe('RjuneGameComponent', () => {
  let component: RjuneGameComponent;
  let fixture: ComponentFixture<RjuneGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RjuneGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RjuneGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

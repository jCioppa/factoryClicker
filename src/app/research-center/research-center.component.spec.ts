import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchCenterComponent } from './research-center.component';

describe('ResearchCenterComponent', () => {
  let component: ResearchCenterComponent;
  let fixture: ComponentFixture<ResearchCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResearchCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

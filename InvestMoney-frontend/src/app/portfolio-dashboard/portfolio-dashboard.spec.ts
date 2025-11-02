import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioDashboard } from './portfolio-dashboard';

describe('PortfolioDashboard', () => {
  let component: PortfolioDashboard;
  let fixture: ComponentFixture<PortfolioDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PortfolioDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

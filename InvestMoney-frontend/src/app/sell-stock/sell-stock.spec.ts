import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellStock } from './sell-stock';

describe('SellStock', () => {
  let component: SellStock;
  let fixture: ComponentFixture<SellStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

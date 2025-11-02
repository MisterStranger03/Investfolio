import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockForm } from './add-stock-form';

describe('AddStockForm', () => {
  let component: AddStockForm;
  let fixture: ComponentFixture<AddStockForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStockForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStockForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

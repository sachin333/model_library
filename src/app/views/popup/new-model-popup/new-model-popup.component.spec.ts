import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewModelPopupComponent } from './new-model-popup.component';

describe('NewModelPopupComponent', () => {
  let component: NewModelPopupComponent;
  let fixture: ComponentFixture<NewModelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewModelPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenModelPopupComponent } from './open-model-popup.component';

describe('OpenModelPopupComponent', () => {
  let component: OpenModelPopupComponent;
  let fixture: ComponentFixture<OpenModelPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenModelPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenModelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

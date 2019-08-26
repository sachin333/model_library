import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RightPaneToolbarComponent } from './right-pane-toolbar.component';

describe('RightPaneToolbarComponent', () => {
  let component: RightPaneToolbarComponent;
  let fixture: ComponentFixture<RightPaneToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RightPaneToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RightPaneToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPaneToolbarComponent } from './top-pane-toolbar.component';

describe('TopPaneToolbarComponent', () => {
  let component: TopPaneToolbarComponent;
  let fixture: ComponentFixture<TopPaneToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopPaneToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPaneToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

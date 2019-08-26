import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlGraphCanvasComponent } from './html-graph-canvas.component';

describe('HtmlGraphCanvasComponent', () => {
  let component: HtmlGraphCanvasComponent;
  let fixture: ComponentFixture<HtmlGraphCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HtmlGraphCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HtmlGraphCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

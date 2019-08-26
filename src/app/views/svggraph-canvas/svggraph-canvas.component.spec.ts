import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SVGGraphCanvasComponent } from './svggraph-canvas.component';

describe('SVGGraphCanvasComponent', () => {
  let component: SVGGraphCanvasComponent;
  let fixture: ComponentFixture<SVGGraphCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SVGGraphCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SVGGraphCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCanvasComponent } from './model-canvas.component';

describe('ModelCanvasComponent', () => {
  let component: ModelCanvasComponent;
  let fixture: ComponentFixture<ModelCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelCanvasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelControlBarComponent } from './model-control-bar.component';

describe('ModelControlBarComponent', () => {
  let component: ModelControlBarComponent;
  let fixture: ComponentFixture<ModelControlBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelControlBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelControlBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

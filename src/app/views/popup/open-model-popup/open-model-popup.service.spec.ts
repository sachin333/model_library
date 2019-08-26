import { TestBed } from '@angular/core/testing';

import { OpenModelPopupService } from './open-model-popup.service';

describe('OpenModelPopupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OpenModelPopupService = TestBed.get(OpenModelPopupService);
    expect(service).toBeTruthy();
  });
});

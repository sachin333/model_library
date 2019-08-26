import { TestBed } from '@angular/core/testing';

import { PopupUtilService } from './popup-util.service';

describe('PopupUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PopupUtilService = TestBed.get(PopupUtilService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SVGComponentFactoryService } from './svgcomponent-factory.service';

describe('SVGComponentFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SVGComponentFactoryService = TestBed.get(SVGComponentFactoryService);
    expect(service).toBeTruthy();
  });
});

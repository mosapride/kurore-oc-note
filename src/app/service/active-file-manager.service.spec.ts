import { TestBed } from '@angular/core/testing';

import { ActiveFileManagerService } from './active-file-manager.service';

describe('ActiveFileManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveFileManagerService = TestBed.get(ActiveFileManagerService);
    expect(service).toBeTruthy();
  });
});

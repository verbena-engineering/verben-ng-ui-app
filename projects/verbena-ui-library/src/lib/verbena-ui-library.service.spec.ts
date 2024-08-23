import { TestBed } from '@angular/core/testing';

import { VerbenaUiLibraryService } from './verbena-ui-library.service';

describe('VerbenaUiLibraryService', () => {
  let service: VerbenaUiLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerbenaUiLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

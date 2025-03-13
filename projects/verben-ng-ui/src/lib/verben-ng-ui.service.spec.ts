import { TestBed } from '@angular/core/testing';

import { VerbenNgUiService } from './verben-ng-ui.service';

describe('VerbenNgUiService', () => {
  let service: VerbenNgUiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VerbenNgUiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

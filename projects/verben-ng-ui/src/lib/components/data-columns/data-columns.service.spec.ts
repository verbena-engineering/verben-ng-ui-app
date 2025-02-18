import { TestBed } from '@angular/core/testing';

import { DataColumnsService } from './data-columns.service';

describe('DataColumnsService', () => {
  let service: DataColumnsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataColumnsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

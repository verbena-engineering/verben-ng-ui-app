import { TestBed } from '@angular/core/testing';

import { DataSortService } from './data-sort.service';

describe('DataSortService', () => {
  let service: DataSortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

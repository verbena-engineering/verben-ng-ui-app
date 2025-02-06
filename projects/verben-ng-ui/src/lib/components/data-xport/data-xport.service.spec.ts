import { TestBed } from '@angular/core/testing';

import { DataXportService } from './data-xport.service';

describe('DataXportService', () => {
  let service: DataXportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataXportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

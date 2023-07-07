import { TestBed } from '@angular/core/testing';

import { ModeloProdutoService } from './modelo-produto.service';

describe('ModeloProdutoService', () => {
  let service: ModeloProdutoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeloProdutoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

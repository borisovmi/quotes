import { Injectable } from '@angular/core';
import { BestMatches, BestMatch } from '../_interfaces/search';
import { ApiService } from './api/api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SymbolSearchService {

  constructor(
    private api: ApiService
  ) { }

  async searchSymbols(searchTerm: string): Promise<BestMatch[]> {
    const bestMatches = await this.api.get({
      function: 'SYMBOL_SEARCH',
      keywords: searchTerm
    }).pipe(
      map((res: BestMatches) => {
        res.bestMatches.forEach(elem => {
          this.api.normalizeResponseKeys(elem);
        });
        return res;
      })
    ).toPromise();
    return bestMatches.bestMatches;
  }
}

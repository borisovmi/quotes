import { Injectable } from '@angular/core';
import { ApiService } from './api/api.service';
import { map } from 'rxjs/operators';
import { EquityData, EQUITY_DATA_TYPES, EquityDataTypeToggler } from '../_interfaces/equity';

export class errorKMS {
  ErrorMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquityService {

  get equityDataTypes() { return EQUITY_DATA_TYPES; }

  private equityDataTypeTogglers: EquityDataTypeToggler[] = [
    {
      type: this.equityDataTypes.close,
      text: 'Show Close'
    },
    {
      type: this.equityDataTypes.open,
      text: 'Show Open'
    },
    {
      type: this.equityDataTypes.high,
      text: 'Show High'
    },
    {
      type: this.equityDataTypes.low,
      text: 'Show Low'
    }
  ];

  getEquityDataTypeTogglers() {
    return this.equityDataTypeTogglers;
  }

  constructor(
    private api: ApiService
  ) { }

  async getEquity(equitySymbol: string) {
    const response = await this.api.get({
      function: 'TIME_SERIES_DAILY',
      symbol: equitySymbol
    }).pipe(
      map((res: EquityData) => {
        this.api.normalizeResponseKeys(res);
        return res;
      })
    ).toPromise();
    return response;
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BestMatches } from 'src/app/_interfaces/search';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  get baseApi() { return environment.baseApi; }

  setOptions(paramsObj: object) {
    let httpParamsObj = new HttpParams();
    for (const key in paramsObj) {
      if (paramsObj.hasOwnProperty(key)) {
        httpParamsObj = httpParamsObj.set(key.toString(), paramsObj[key].toString());
      }
    }
    return {
      params: httpParamsObj
    };
  }

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Alphavantage API can return response object with numbered keys, or spaced keys, or include non-word characters.
   * This method wil normalize it, i.e.:
   * "1. symbol" => "symbol"
   * "Meta Data" => "MetaData"
   * "Time Series (Daily)" => "TimeSeriesDaily"
   * @param obj any object
   */
  normalizeResponseKeys(obj: {}) {
    Object.keys(obj).forEach(key => {
      const newKeyName = key.replace(/(?!-)(\W|\d+\.)/gi, '');
      obj[newKeyName] = obj[key];
      if (newKeyName !== key) {
        delete obj[key];
      }
      if (Object.keys(obj[newKeyName]).length > 0 && obj[newKeyName] instanceof Object) {
        this.normalizeResponseKeys(obj[newKeyName]);
      }
    });
  }

  get(params: object = {}) {
    return this.http.get(`${this.baseApi}`, this.setOptions(params));
  }
}

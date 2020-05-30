import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription, fromEvent } from 'rxjs';
import { EquityService } from '../_services/equity.service';
import { EquityData, EquityDataType, EQUITY_DATA_TYPES, EquityDataTypeToggler } from '../_interfaces/equity';
import { Location } from '@angular/common';
import { debounceTime, startWith } from 'rxjs/operators';
import { ErrorStateService } from '../_services/error-state.service';


export interface DataPoints {
  name: string;
  series: DataPoint[];
}
export interface DataPoint {
  name: string;
  value: string;
}

@Component({
  selector: 'kms-equity-page',
  templateUrl: './equity-page.component.html',
  styleUrls: ['./equity-page.component.scss']
})
export class EquityPageComponent implements OnInit, OnDestroy {

  get equityDataTypes() { return EQUITY_DATA_TYPES; }

  loading = true;

  equity: EquityData;

  equityDataType: EquityDataType = this.equityDataTypes.close;
  equityDataTypeTogglers: EquityDataTypeToggler[];

  dataPoints: DataPoints[] = [{
    name: '',
    series: []
  }];
  viewSizes = { height: 0, width: 0 };

  resizeObservable$ = fromEvent(window, 'resize');
  resizeSubscription$: Subscription;

  constructor(
    private ar: ActivatedRoute,
    private router: Router,
    private mediaMatcher: MediaMatcher,
    private errorService: ErrorStateService,
    private equityService: EquityService
  ) { }

  ngOnInit(): void {
    this.equityDataTypeTogglers = this.equityService.getEquityDataTypeTogglers();

    this.ar.params.subscribe(async params => {
      this.loading = true;

      if (this.resizeSubscription$) {
        this.resizeSubscription$.unsubscribe();
      }

      this.equity = await this.equityService.getEquity(params.equitySymbol);

      if (this.equity['ErrorMessage']) {
        this.errorService.navigate404(this.router.routerState.snapshot.url);
      } else {
        this.loading = false;
        this.resizeSubscription$ = this.resizeObservable$.pipe(
          debounceTime(200),
          startWith([null]),
        ).subscribe(event => {
          const isSmallScreen = this.mediaMatcher.matchMedia('(max-width: 599.99px)');
          let newWidth: number;
          if (isSmallScreen.matches) {
            newWidth = window.innerWidth * 0.9;
          } else {
            newWidth = window.innerWidth * 0.7;
          }
          this.viewSizes = { ...this.viewSizes, width: newWidth };
        });
        this.setEquityDataType(this.equityDataType);
      }
    });
  }

  setEquityDataType(type: EquityDataType) {
    this.equityDataType = type;

    const newDataPoints: DataPoints[] = [{
      name: this.equity?.MetaData?.Symbol,
      series: []
    }];

    for (const key in this.equity?.TimeSeriesDaily) {
      if (this.equity.TimeSeriesDaily.hasOwnProperty(key)) {
        newDataPoints[0].series.push({
          name: key,
          value: this.equity.TimeSeriesDaily[key][this.equityDataType]
        });
      }
    }

    this.dataPoints = newDataPoints;
  }

  ngOnDestroy() {
    if (this.resizeSubscription$) {
      this.resizeSubscription$.unsubscribe();
    }
  }

}

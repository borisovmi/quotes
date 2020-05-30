export interface EquityData {
  MetaData: EquityMetaData;
  TimeSeriesDaily: EquityDailyData[];
}

export interface EquityMetaData {
  Information: string;
  Symbol: string;
  LastRefreshed: string;
  OutputSize: string;
  TimeZone: string;
}

export interface EquityDailyData {
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
}

export interface EquityDataTypeToggler {
  type: EquityDataType;
  text: string;
}

export enum EQUITY_DATA_TYPES {
  open = 'open',
  close = 'close',
  high = 'high',
  low = 'low'
}

export type EquityDataType = EQUITY_DATA_TYPES.open | EQUITY_DATA_TYPES.close | EQUITY_DATA_TYPES.high | EQUITY_DATA_TYPES.low;


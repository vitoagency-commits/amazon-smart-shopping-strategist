export interface AmazonProduct {
  type: 'BEST-BUY' | 'PROFESSIONAL' | 'AFFARE DEL MOMENTO';
  name: string;
  whyBuy: string;
  weakPoint: string;
  amazonLink: string;
}

export interface StrategistResponse {
  needsMoreInfo: boolean;
  question?: string;
  products?: AmazonProduct[];
  copyText?: string;
}

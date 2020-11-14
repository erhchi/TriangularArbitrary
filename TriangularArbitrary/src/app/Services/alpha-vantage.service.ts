import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AlphaVantageService {

  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
   }

getStocks(symbol: string) {
  let headers = new HttpHeaders().set('x-rapidapi-host','alpha-vantage.p.rapidapi.com').set('x-rapidapi-key','3a817c55c4mshffc3fa4189b8ad3p11a7fajsn7113f1cd4087');
  return this.http.get("https://alpha-vantage.p.rapidapi.com/query?symbol=" + symbol + "&function=GLOBAL_QUOTE",{ headers });
}

getCurrencyExchange(to:string, from:string) {
  let headers = new HttpHeaders().set('x-rapidapi-host','alpha-vantage.p.rapidapi.com').set('x-rapidapi-key','dab15a3f9cmshddce05f66ea95dcp13569ejsn701258d7a016');
  return this.http.get("https://alpha-vantage.p.rapidapi.com/query?function=CURRENCY_EXCHANGE_RATE&to_currency="+to+"&from_currency="+from, {headers});
}

}
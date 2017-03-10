import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { forkJoin as staticForkJoin } from 'rxjs/observable/forkJoin';

import { HourA } from './HourA';
import { Hour378 } from './Hour378';
import { Hour160 } from './Hour160';
import { Hour157 } from './Hour157';
import { Weather } from './Weather';
import { Stock, StockCollection, StockAPI } from './Stock';
import { Vehicle, VehicleCollection } from './Vehicle';

import { Config } from '../config/config';


@Injectable()
export class InfoService {
    private ratpUrl = Config.getEnvironmentVariable("ratpUrl"); 
    private rerAUrl = Config.getEnvironmentVariable("rerAUrl"); 
    private bus378Url = Config.getEnvironmentVariable("bus378Url"); 
    private bus160Url = Config.getEnvironmentVariable("bus160Url"); 
    private bus157Url = Config.getEnvironmentVariable("bus157Url"); 
    private weatherUrl = Config.getEnvironmentVariable("weatherUrl");
    private testlaUrl = Config.getEnvironmentVariable("testlaUrl");  
    private stockUrls = Config.getEnvironmentVariable("stockUrls");  
    private ratpUrls = Config.getEnvironmentVariable("ratpUrls");  

    constructor(private http: Http) { }

    getHours(): Observable<any> {
        return Observable.forkJoin(
            this.http.get(this.ratpUrl + this.rerAUrl).map((res: Response) => res.json()),
            this.http.get(this.ratpUrl + this.rerAUrl).map((res: Response) => res.json())
        )
    }

    public getRerAHour(): Observable<HourA[]> {
        return this.http.get(this.ratpUrl + this.rerAUrl)
            .map(this.extractData)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error')); 
    }

    public get378Hour(): Observable<Hour378[]> {
        return this.http.get(this.ratpUrl + this.bus378Url)
            .map(this.extractData)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public get160Hour(): Observable<Hour160[]> {
        return this.http.get(this.ratpUrl + this.bus160Url)
            .map(this.extractData)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public get157Hour(): Observable<Hour157[]> {
        return this.http.get(this.ratpUrl + this.bus157Url)
            .map(this.extractData)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public getWeather(): Observable<Weather> {
        return this.http.get(this.weatherUrl)
            .map(this.extractData_weather)
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    public compare(a: Stock, b: Stock): number {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    public getStock(): Observable<StockCollection> {
        let result = new StockCollection();
        result.stocks = new Array<Stock>();

        for (var i = 0; i < this.stockUrls.length; i++) {
            this.http.get(this.stockUrls[i])
                .map(this.extractData_stock)
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
                .subscribe(x => { result.stocks.push(x); });
        }
        return Observable.create(obs => { result.stocks = result.stocks.sort(this.compare); obs.next(result); obs.complete(); });
    }

    public getVehicle(): Observable<VehicleCollection> {
        let result = new VehicleCollection();
        result.vehicles = new Array<Vehicle>();

        for (var i = 0; i < this.ratpUrls.length; i++) {
            this.http.get(this.ratpUrls[i])
                .map(this.extractData)
                .catch((error: any) => Observable.throw(error.json().error || 'Server error'))
                .subscribe(x => { result.vehicles.push(x); });
        }
        return Observable.create(obs => { result.vehicles = result.vehicles; obs.next(result); obs.complete(); });
    }

    public extractData(res: Response) {
        let body = res.json();
        return body.response.schedules || {};
    }

    public extractData_weather(res: Response) {
        let body = res.json();
        return body.current || {};
    }

    public extractData_stock(res: Response) {
        let body = JSON.parse(res.text().substr(3))[0];
        let s = new Stock();
        s.name = body.t || "";
        s.value = body.l || "";
        return s; 
    }
}
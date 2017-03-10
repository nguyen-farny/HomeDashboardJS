import { Component, OnInit } from '@angular/core';
import { ApplicationRef } from '@angular/core/src/application_ref';
import * as moment from 'moment-timezone';

import { Observable } from 'rxjs/Rx';

import { Weather } from './Weather';
import { Condition } from './Condition';
import { StockCollection } from './Stock';
import { VehicleCollection } from './Vehicle';
import * as Time from './Time';

import { InfoService } from './getInfo.service';
import { Config } from '../config/config';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [InfoService]
})
export class AppComponent implements OnInit {
    private stockUrls = Config.getEnvironmentVariable("stockUrls");  
    errorMessage: string;
    times: Time.TimeCollection; 
    weatherToday: Weather;
    weatherTomorrow: Weather;
    condition: Condition; 
    stocks: StockCollection;
    vehicles: VehicleCollection; 

    constructor(private infoService: InfoService, private applicationRef: ApplicationRef) {
    }
    getWeatherTomorrow() {
        this.infoService.getWeatherTomorrow()
            .subscribe(
            weatherTomorrow => this.weatherTomorrow = weatherTomorrow,
            error => this.errorMessage = <any>error,
            () => this.applicationRef.tick()
            );
    }


    getWeatherToday() {
        this.infoService.getWeatherToday()
            .subscribe(
            weatherToday => this.weatherToday = weatherToday,
            error => this.errorMessage = <any>error,
            () => this.applicationRef.tick()
            );
    }

    getHour() {
        this.times = new Time.TimeCollection();
        this.times.times = new Array<Time.Time>();

        var timezones = Config.getEnvironmentVariable("timezones");
        for (let timezone of timezones) {
            this.times.times.push(new Time.Time(timezone.name, moment().tz(timezone.timeZone).format("HH:mm")));
        }
    }
    
    IsDay(): boolean{
        return moment().get('hour') < 19; 
    }
    IfHasVehicle(message: string): boolean {
        return message.length < 6; 
    }

    getStock() {
            this.infoService.getStock()
                .subscribe(
                stocks => this.stocks = stocks,
                error => this.errorMessage = <any>error,
                () => this.applicationRef.tick()
                );
    }

    getVehicle() {
        this.infoService.getVehicle()
            .subscribe(
            vehicles => this.vehicles = vehicles,
            error => this.errorMessage = <any>error,
            () => this.applicationRef.tick()
            );
    }

    ngOnInit(): void {
        let timer6s = Observable.timer(0, 1000 * 6);

        Observable.timer(0, 1000 * 30).subscribe(() => this.getStock());
        Observable.timer(0, 1000 * 60).subscribe(() => this.getVehicle());

        let timer2h = Observable.timer(0, 1000 * 3600 * 2);
        timer2h.subscribe(() => this.getWeatherToday());
        timer2h.subscribe(() => this.getWeatherTomorrow());

        let timer1s = Observable.timer(0, 1000);
        timer1s.subscribe(() => this.getHour());
    }
}

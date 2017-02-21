import { Component, OnInit } from '@angular/core';
import { ApplicationRef } from '@angular/core/src/application_ref';
import * as moment from 'moment-timezone';

import { Observable } from 'rxjs/Rx';
import { HourA } from './HourA';
import { Hour378 } from './Hour378';
import { Hour160 } from './Hour160';
import { Hour157 } from './Hour157';
import { Weather } from './Weather';
import { Condition } from './Condition';
import { StockCollection } from './Stock';
import * as Time from './Time';

import { InfoService } from './getInfo.service';
import { Config } from '../config/config.ts';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [InfoService]
})
export class AppComponent implements OnInit {
    private stockUrls = Config.getEnvironmentVariable("stockUrls");  
    errorMessage: string;
    hoursA: HourA[];
    hours378: Hour378[];
    hours160: Hour160[];
    hours157: Hour157[];

    times: Time.TimeCollection; 
    weather: Weather;
    condition: Condition; 
    stocks: StockCollection;

    constructor(private infoService: InfoService, private applicationRef: ApplicationRef) {
    }

    getRerAHour() {
        this.infoService.getRerAHour()
            .subscribe(
            hours => this.hoursA = hours,
            error => this.errorMessage = <any>error,
            () => this.applicationRef.tick()
            );
    }

    get378Hour() {
        this.infoService.get378Hour()
            .subscribe(
            hours378 => this.hours378 = hours378,
            error => this.errorMessage = <any>error,
            () => this.applicationRef.tick()
            );
    }

    get160Hour() {
        this.infoService.get160Hour()
            .subscribe(
            hours160 => this.hours160 = hours160,
            error => this.errorMessage = <any>error,
            () => this.applicationRef.tick()
            );
    }

    get157Hour() {
        this.infoService.get157Hour()
            .subscribe(
            hours157 => this.hours157 = hours157,
            error => this.errorMessage = <any>error,
            () => this.applicationRef.tick()
            );
    }

    getWeather() {
        this.infoService.getWeather()
            .subscribe(
            weather => this.weather = weather,
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
    
    IfHour(message: string): boolean {
        return message.length < 6; 
    }

    //getApple() {
    //    this.infoService.getApple()
    //        .subscribe(
    //        stock => this.stock = stock,
    //        error => this.errorMessage = <any>error,
    //        () => this.applicationRef.tick()
    //        );
    //}

    getStock() {
            this.infoService.getStock()
                .subscribe(
                stocks => this.stocks = stocks,
                error => this.errorMessage = <any>error,
                () => this.applicationRef.tick()
                );
    }

    ngOnInit(): void {
        let timer6s = Observable.timer(0, 1000 * 6);
        timer6s.subscribe(() => this.getRerAHour());
        timer6s.subscribe(() => this.get378Hour());
        timer6s.subscribe(() => this.get160Hour());
        timer6s.subscribe(() => this.get157Hour());

        Observable.timer(0, 1000 * 30).subscribe(() => this.getStock());


        let timer2h = Observable.timer(0, 1000 * 3600 * 2);
        timer2h.subscribe(() => this.getWeather());

        let timer1s = Observable.timer(0, 1000);
        timer1s.subscribe(() => this.getHour());
    }
}

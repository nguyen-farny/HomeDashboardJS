import { Component, OnInit } from '@angular/core';
import { ApplicationRef } from '@angular/core/src/application_ref';
import * as moment from 'moment';

import { Observable } from 'rxjs/Rx';
import { HourA } from './HourA';
import { Hour378 } from './Hour378';
import { Hour160 } from './Hour160';
import { Hour157 } from './Hour157';
import { Weather } from './Weather';
import { Condition } from './Condition';
import { Tesla } from './Tesla';


import { InfoService } from './getInfo.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [InfoService]
})
export class AppComponent implements OnInit {
    errorMessage: string;
    hoursA: HourA[];
    hours378: Hour378[];
    hours160: Hour160[];
    hours157: Hour157[];

    hourFr: string;
    hourVn: string;
    hourCali: string;

    weather: Weather;
    condition: Condition; 
    tesla: Tesla[]; 

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
        this.hourFr = moment().format("HH:mm");
        this.hourVn = moment().utcOffset('+0700').format("HH:mm");
        this.hourCali = moment().utcOffset('-0800').format("HH:mm");
    }

    IfHour(message: string): boolean {
        return message.length < 6; 
    }

    ngOnInit(): void {
        let timer6s = Observable.timer(0, 1000 * 6);
        timer6s.subscribe(() => this.getRerAHour());
        timer6s.subscribe(() => this.get378Hour());
        timer6s.subscribe(() => this.get160Hour());
        timer6s.subscribe(() => this.get157Hour());

        let timer2h = Observable.timer(0, 1000 * 3600 * 2);
        timer2h.subscribe(() => this.getWeather());

        let timer1s = Observable.timer(0, 1000);
        timer1s.subscribe(() => this.getHour());
    }
}

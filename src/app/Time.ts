export class Time {
    country: string;
    value: string;

    constructor(country: string, value: string) {
        this.country = country;
        this.value = value; 
    }
}

export class TimeCollection {
    times: Time[];
}
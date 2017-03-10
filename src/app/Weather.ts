import { Condition } from './Condition';

export class Weather {
    feelslike_c: number; 
    temp_c: number;
    condition: Condition;
    precip_mm: number;
    is_day: number;
    mintemp_c : number; 
    maxtemp_c: number; 
    totalprecip_mm: number;
}

/// <reference path="autosize.directive.ts" />
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Autosize } from './autosize.directive';


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
      AppComponent, 
      Autosize
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

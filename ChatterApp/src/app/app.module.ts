import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AppComponent } from './app.component';
import { LoginComponent } from "./login/login.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
	AppComponent,
	LoginComponent
  ],
  imports: [
	  BrowserModule,
	  HttpClientModule,
	  BrowserAnimationsModule,
	  MatFormFieldModule,
	  MatInputModule,
	  MatButtonModule,
	  FormsModule,
	  HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

import { AppComponent } from './app.component';
import { LoginComponent } from "./login/login.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from './register/register.component';
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { ToastComponent } from './toast/toast.component';
import { RoutingModule } from "./routing/routing.module";
import { httpInterceptorProviders } from "./interceptors";
import { HomeComponent } from './home/home.component';
import { ChatRoomListComponent } from './chatroom-list/chat-room-list.component';
import { ChatRoomButtonComponent } from './chatroom-button/chat-room-button.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { CommonModule } from "@angular/common";
import { RouteReuseStrategy } from "@angular/router";
import { AppRouteReuseStrategy } from "./routing/route-reuse-strategy";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		ToastComponent,
		HomeComponent,
		ChatRoomListComponent,
		ChatRoomButtonComponent,
		ChatRoomComponent
	],
	imports: [
		CommonModule,
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		FormsModule,
		HttpClientModule,
		ReactiveFormsModule,
		MatStepperModule,
		MatIconModule,
		MatSnackBarModule,
		RoutingModule
	],
	providers: [
		httpInterceptorProviders,
		{
			provide: RouteReuseStrategy,
			useClass: AppRouteReuseStrategy
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}

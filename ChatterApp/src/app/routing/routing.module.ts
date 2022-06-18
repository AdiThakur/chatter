import { NgModule } from '@angular/core';
import { Route, RouterModule } from "@angular/router";
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from "../register/register.component";

const routes: Route[] = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '**', component: LoginComponent }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})
export class RoutingModule {}

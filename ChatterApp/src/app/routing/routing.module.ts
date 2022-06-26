import { NgModule } from '@angular/core';
import { Route, RouterModule } from "@angular/router";
import { RegisterComponent } from "../register/register.component";
import { HomeComponent } from "../home/home.component";
import { AuthGuard } from "../guards/auth.guard";
import { LoginComponent } from "../login/login.component";

const routes: Route[] = [
	{ path: 'register', component: RegisterComponent },
	{ path: 'login', component: LoginComponent },
	{ path: '', component: HomeComponent,  canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '',  canActivate: [AuthGuard] }
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

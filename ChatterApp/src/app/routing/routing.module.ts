import { NgModule } from '@angular/core';
import { Route, RouterModule } from "@angular/router";
import { RegisterComponent } from "../register/register.component";
import { HomeComponent } from "../home/home.component";
import { AuthGuard } from "../guards/auth.guard";
import { LoginComponent } from "../login/login.component";
import { UnAuthGuard } from "../guards/un-auth.guard";
import { ChatRoomComponent } from "../chat-room/chat-room.component";

const routes: Route[] = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent, canActivate: [UnAuthGuard]},
	{
		path: '',
		component: HomeComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'chatroom/:chatRoomId',
				component: ChatRoomComponent
			}
		]
	},
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

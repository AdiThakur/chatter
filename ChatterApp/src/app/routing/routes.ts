import { Route } from "@angular/router";
import { LoginComponent } from "../login/login.component";
import { RegisterComponent } from "../register/register.component";
import { UnAuthGuard } from "../guards/un-auth.guard";
import { HomeComponent } from "../home/home.component";
import { AuthGuard } from "../guards/auth.guard";
import { ChatRoomComponent } from "../chat-room/chat-room.component";
import { ResultsComponent } from "../results/results.component";

export const Routes: Route[] = [
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'register',
		component: RegisterComponent,
		canActivate: [UnAuthGuard]
	},
	{
		path: 'home',
		component: HomeComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'chatroom/:chatRoomId',
				component: ChatRoomComponent
			},
			{
				path: 'results',
				component: ResultsComponent
			}
		]
	},
	{
		path: '**',
		redirectTo: 'home'
	},
];

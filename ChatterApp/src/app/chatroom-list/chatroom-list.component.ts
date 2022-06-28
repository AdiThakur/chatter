import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from "../services/user.service";
import { ChatRoomModel } from "../../types/chat-room-model";
import { HttpService } from "../services/http.service";

@Component({
	selector: 'chatroom-list',
	templateUrl: './chatroom-list.component.html',
	styleUrls: ['./chatroom-list.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ChatroomListComponent implements OnInit {

	public chatRooms: ChatRoomModel[] = [];

	constructor(
		private httpService: HttpService,
		private userService: UserService
	) {}

	ngOnInit(): void {

		// TODO: get chatrooms from backend
		this.chatRooms = [
			{
				id: "CSC301",
				description: "Into to Software Engineering",
				users: ["adityathakur", "adi"]
			},
			{
				id: "CSC309",
				description: "Into to Web Development",
				users: ["adityathakur", "adi", "john", "jane"]
			},
		]

	}

}

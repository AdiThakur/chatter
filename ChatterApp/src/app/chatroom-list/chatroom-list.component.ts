import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatRoomModel } from "../../types/chat-room-model";
import { ChatRoomService } from "../services/chat-room.service";

@Component({
	selector: 'chatroom-list',
	templateUrl: './chatroom-list.component.html',
	styleUrls: ['./chatroom-list.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ChatroomListComponent implements OnInit {

	public chatRooms: ChatRoomModel[] = [];

	constructor(
		private chatRoomService: ChatRoomService
	) {}

	ngOnInit(): void {
		this.chatRoomService
			.getChatRooms()
			.subscribe((chatRooms) => {
				this.chatRooms = chatRooms;
			});
	}
}

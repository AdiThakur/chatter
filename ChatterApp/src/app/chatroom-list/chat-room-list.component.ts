import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatRoomModel } from "../../types/chat-room-model";
import { ChatRoomService } from "../services/chat-room.service";

@Component({
	selector: 'chatroom-list',
	templateUrl: './chat-room-list.component.html',
	styleUrls: ['./chat-room-list.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ChatRoomListComponent implements OnInit {

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

import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatRoomModel } from "../../types/chat-room-model";
import { MessageModel } from "../../types/message-model";
import { ChatRoomService } from "../services/chat-room.service";

@Component({
	selector: 'chatroom-list',
	templateUrl: './chatroom-list.component.html',
	styleUrls: ['./chatroom-list.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class ChatroomListComponent implements OnInit {

	public chatRooms: ChatRoomModel[] = [];
	public latestMessage: MessageModel = {
		id: 1,
		chatRoomId: "CSC301",
		timeStamp: new Date(),
		authorName: "shadyman",
		authorAvatarUri: "assets/avatar2.png",
		content: "Hello how's it going"
	}

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

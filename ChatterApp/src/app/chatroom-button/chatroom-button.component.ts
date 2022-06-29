import { Component, Input, OnInit } from '@angular/core';
import { ChatRoomModel } from "../../types/chat-room-model";
import { MessageModel } from "../../types/message-model";
import { ChatRoomService } from "../services/chat-room.service";

@Component({
	selector: 'chatroom-button',
	templateUrl: './chatroom-button.component.html',
	styleUrls: ['./chatroom-button.component.css']
})
export class ChatroomButtonComponent implements OnInit {

	@Input()
	public chatRoom: ChatRoomModel;

	public latestMessage: null | MessageModel;

	constructor(
		private chatRoomService: ChatRoomService
	) {}

	ngOnInit(): void {
		this.chatRoomService
			.getLatestMessageForChatRoom(this.chatRoom.id)
			.subscribe((latestMessage) => {
				this.latestMessage = latestMessage;
			});
		;
	}
}

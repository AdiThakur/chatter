import { Component, Input, OnInit } from '@angular/core';
import { ChatRoomModel } from "../../types/chat-room-model";
import { MessageModel } from "../../types/message-model";
import { ChatRoomService } from "../services/chat-room.service";
import { Router } from "@angular/router";

@Component({
	selector: 'chatroom-button',
	templateUrl: './chat-room-button.component.html',
	styleUrls: ['./chat-room-button.component.css']
})
export class ChatRoomButtonComponent implements OnInit {

	@Input()
	public chatRoom: ChatRoomModel;

	public latestMessage: null | MessageModel;

	constructor(
		private router: Router,
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

	public openChatRoom(): void {
		this.chatRoomService.openChatRoom(this.chatRoom);
	}
}

import { Component, Input, OnInit } from '@angular/core';
import { ChatRoomModel } from "../../types/chat-room-model";
import { MessageModel } from "../../types/message-model";
import { ChatRoomService } from "../services/chat-room.service";
import { Router } from "@angular/router";
import { AbsolutePath } from "../routing/absolute-paths";
import { ChatService } from "../services/chat.service";

@Component({
	selector: 'chatroom-button',
	templateUrl: './chat-room-button.component.html',
	styleUrls: ['./chat-room-button.component.css']
})
export class ChatRoomButtonComponent implements OnInit {

	@Input()
	public chatRoom: ChatRoomModel;
	public latestMessage: null | MessageModel;
	public isSelected = false;

	constructor(
		private router: Router,
		private chatRoomService: ChatRoomService,
		private chatService: ChatService
	) {}

	ngOnInit(): void {
		this.chatRoomService
			.getLatestMessageForChatRoom(this.chatRoom.id)
			.subscribe((latestMessage) => {
				this.latestMessage = latestMessage;
			});

		this.chatRoomService.selectedChatRoom$.subscribe(
			selectedChatRoomId => {
				this.isSelected = selectedChatRoomId == this.chatRoom.id;
			}
		);

		this.chatService.messages$.subscribe(message => {
			if (message.chatRoomId == this.chatRoom.id) {
				this.latestMessage = message;
			}
		});
	}

	public openChatRoom(): void {
		this.chatRoomService.selectChatRoom(this.chatRoom.id);
		this.router.navigate([AbsolutePath.ChatRoom, this.chatRoom.id]);
	}
}

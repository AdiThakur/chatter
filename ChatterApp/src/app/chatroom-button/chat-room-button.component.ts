import { Component, Input, OnInit } from '@angular/core';
import { ChatRoomModel } from "../../types/chat-room-model";
import { ChatRoomService } from "../services/chat-room.service";
import { Router } from "@angular/router";
import { AbsolutePath } from "../routing/absolute-paths";
import { ChatService } from "../services/chat.service";
import { SidenavService } from "../services/sidenav.service";

@Component({
	selector: 'chatroom-button',
	templateUrl: './chat-room-button.component.html',
	styleUrls: ['./chat-room-button.component.css']
})
export class ChatRoomButtonComponent implements OnInit {

	@Input()
	public chatRoom: ChatRoomModel;
	public isSelected = false;

	constructor(
		private router: Router,
		private sidenavService: SidenavService,
		private chatRoomService: ChatRoomService,
		private chatService: ChatService
	) {}

	ngOnInit(): void {
		this.observeSelectedChatRoom();
		this.observeMessages();
	}

	private observeSelectedChatRoom(): void {
		this.chatRoomService.selectedChatRoom$.subscribe(
			selectedChatRoomId => {
				this.isSelected = selectedChatRoomId == this.chatRoom.id;
			}
		);
	}

	private observeMessages(): void {
		this.chatService.messages$.subscribe(message => {
			if (message.chatRoomId == this.chatRoom.id) {
				this.chatRoom.latestMessage = message;
			}
		});
	}

	public openChatRoom(): void {
		this.sidenavService.close();
		this.chatRoomService.selectChatRoom(this.chatRoom.id);
		this.router.navigate([AbsolutePath.ChatRoom, this.chatRoom.id]);
	}

	public leaveChatRoom(): void {
		if (!this.isSelected) {
			this.chatRoomService.leaveChatRoom(this.chatRoom.id);
			return;
		}
		this.router
			.navigate([AbsolutePath.Home])
			.then(() => {
				this.chatRoomService.leaveChatRoom(this.chatRoom.id);
			});
	}
}

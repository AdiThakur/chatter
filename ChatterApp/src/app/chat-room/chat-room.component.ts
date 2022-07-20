import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ChatRoomService } from "../services/chat-room.service";

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

	public chatRoomId: null | string = null;

	constructor(
		private activatedRoute: ActivatedRoute,
		private chatRoomService: ChatRoomService
	) {}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.chatRoomId = params['chatRoomId'];
			if (this.chatRoomId != null && this.chatRoomId != '') {
				this.chatRoomService.selectChatRoom(this.chatRoomId);
			}
		});
	}
}

import { Component, Input, OnInit } from '@angular/core';
import { ChatRoomModel } from "../../types/chat-room-model";
import { MessageModel } from "../../types/message-model";

@Component({
	selector: 'chatroom-button',
	templateUrl: './chatroom-button.component.html',
	styleUrls: ['./chatroom-button.component.css']
})
export class ChatroomButtonComponent implements OnInit {

	@Input()
	public chatRoom: ChatRoomModel;

	@Input()
	public latestMessage: MessageModel;

	constructor() {}

	ngOnInit(): void {

	}
}

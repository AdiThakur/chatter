import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

	chatRoomId: string = "";

	constructor(
		private activatedRoute: ActivatedRoute
	) {
	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe(params => {
			this.chatRoomId = params['chatRoomId'];
		});
	}
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatRoomModel } from "../../types/chat-room-model";

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

	public query: string;
	public chatRooms: ChatRoomModel[] = [];

	constructor(
		private route: ActivatedRoute,
		private chatRoomService: ChatRoomService
	) {}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.query = params.query;
			this.fetchMatchingChatRooms();
		});
	}

	private fetchMatchingChatRooms(): void {
		this.chatRoomService
			.fetchMatchingChatRooms(this.query)
			.subscribe(chatRooms => this.chatRooms = chatRooms);
	};
}

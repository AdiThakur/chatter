import { Component, OnInit } from '@angular/core';
import { ChatRoomModel } from "../../types/chat-room-model";
import { ChatRoomService } from "../services/chat-room.service";

@Component({
	selector: 'chatroom-list',
	templateUrl: './chat-room-list.component.html',
	styleUrls: ['./chat-room-list.component.css']
})
export class ChatRoomListComponent implements OnInit {

	public query = "";
	public chatRooms: ChatRoomModel[] = [];
	public filteredChatRooms: ChatRoomModel[] = [];

	constructor(
		private chatRoomService: ChatRoomService
	) {}

	ngOnInit(): void {
		this.chatRooms = this.chatRoomService.chatRooms;
		this.filteredChatRooms = this.chatRooms;
	}

	public onFilter(): void {
		if (this.query == "") {
			this.removeFilter();
		} else {
			this.applyFilter();
		}
	}

	public removeFilter(): void {
		this.query = '';
		this.filteredChatRooms = this.chatRooms;
	}

	private applyFilter(): void {
		const lowerCaseQuery = this.query.toLowerCase();
		this.filteredChatRooms = this.chatRooms.filter(chatRoom => {
			return (
				chatRoom.id.toLowerCase().includes(lowerCaseQuery) ||
				chatRoom.description.toLowerCase().includes(lowerCaseQuery)
			);
		})
	}
}

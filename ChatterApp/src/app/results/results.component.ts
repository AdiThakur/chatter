import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "../services/user.service";
import { ToastService } from "../toast/toast.service";

type ChatRoomViewModel = ChatRoomModel & { alreadyJoined: boolean };

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

	public query: string;
	public chatRooms: ChatRoomModel[] = [];
	public chatRoomsMap: { [key: string]: ChatRoomViewModel }= {};

	constructor(
		private route: ActivatedRoute,
		private toastService: ToastService,
		private userService: UserService,
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
			.subscribe(chatRooms => {
				this.chatRooms = chatRooms;
				this.initChatRoomsMap();
			});
	};

	private initChatRoomsMap(): void {
		this.chatRooms.forEach(chatRoom => {
			let viewChatRoom = chatRoom as ChatRoomViewModel;
			viewChatRoom.alreadyJoined =
				this.userService.user.chatRooms.some(chatRoomId => chatRoomId === chatRoom.id);
			this.chatRoomsMap[viewChatRoom.id] = viewChatRoom;
		});
	}

	public joinChatRoom(chatRoomId: string): void {
		this.chatRoomService
			.joinChatRoom(chatRoomId)
			.subscribe(
				() => {
					this.chatRoomsMap[chatRoomId].alreadyJoined = true;
					this.toastService.createSuccessToast(`Joined ${chatRoomId}`);
				},
				() => {
					this.toastService.createErrorToast(`Could not join ${chatRoomId}`);
				}
			);
	}

}

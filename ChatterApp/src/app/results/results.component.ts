import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatRoomModel } from "../../types/chat-room-model";
import { UserService } from "../services/user.service";
import { ToastService } from "../toast/toast.service";
import { InfiniteLoader } from "../helpers/loader";
import { finalize } from "rxjs/operators";

type ChatRoomViewModel = ChatRoomModel & { alreadyJoined: boolean };

@Component({
	selector: 'app-results',
	templateUrl: './results.component.html',
	styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

	public loader: InfiniteLoader;
	public query: string;
	public chatRooms: ChatRoomViewModel[] = [];

	constructor(
		private route: ActivatedRoute,
		private toastService: ToastService,
		private userService: UserService,
		private chatRoomService: ChatRoomService
	) {
		this.loader = new InfiniteLoader(250);
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.query = params.query;
			this.fetchMatchingChatRooms();
		});
	}

	private fetchMatchingChatRooms(): void {
		this.loader.startLoad();
		this.chatRoomService
			.fetchMatchingChatRooms(this.query)
			.pipe(finalize(() => this.loader.finishLoad()))
			.subscribe(chatRooms => {
				this.setChatRooms(chatRooms);
			});
	};

	private setChatRooms(chatRooms: ChatRoomModel[]): void {
		this.transformToViewModel(chatRooms);
		this.sortChatRooms();
	}

	private transformToViewModel(chatRooms: ChatRoomModel[]): void {
		this.chatRooms = chatRooms.map(chatRoom => {
			let viewChatRoom = chatRoom as ChatRoomViewModel;
			viewChatRoom.alreadyJoined = this.userService.isUserInChatRoom(viewChatRoom.id);
			return viewChatRoom;
		});
	}

	private sortChatRooms(): void {
		this.chatRooms.sort((room1, room2) => {
			if (!room1.alreadyJoined && room2.alreadyJoined) {
				return -1;
			} else if (room1.alreadyJoined && !room2.alreadyJoined) {
				return 1;
			} else if (room1.alreadyJoined == room2.alreadyJoined) {
				if (room1.id >= room2.id) {
					return 1;
				} else {
					return -1;
				}
			}
			return 0;
		});
	}

	public joinChatRoom(chatRoomId: string): void {
		this.chatRoomService
			.joinChatRoom(chatRoomId)
			.subscribe(() => {
				let chatRoom = this.chatRooms.find(chatRoom => chatRoom.id == chatRoomId)!;
				chatRoom.alreadyJoined = true;
				this.toastService.createSuccessToast(`Joined ${chatRoomId}`);
			});
	}
}

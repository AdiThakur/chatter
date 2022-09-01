import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { ChatRoomService } from "../services/chat-room.service";
import { ChatService } from "../services/chat.service";
import { MessageModel } from "../../types/message-model";
import { UserService } from "../services/user.service";
import { InfiniteLoader } from "../helpers/loader";
import { KeyPressHandler } from "../helpers/key-press-handler";
import { finalize } from "rxjs/operators";
import { MessageManager } from "./MessageManager";
import { Paginator } from "../helpers/Paginator";
import { ViewPortService } from "../services/view-port.service";

@Component({
	selector: 'app-chat-room',
	templateUrl: './chat-room.component.html',
	styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit {

	public chatRoomId: string;
	public memberCount = 0;
	public messageToSend: string = "";

	private paginator: Paginator;
	public loader: InfiniteLoader;
	public messageManager: MessageManager;
	public keyHandler: KeyPressHandler;

	constructor(
		private location: Location,
		private activatedRoute: ActivatedRoute,
		private viewportService: ViewPortService,
		private userService: UserService,
		private chatRoomService: ChatRoomService,
		private chatService: ChatService
	) {
		this.initPaginator();
		this.loader = new InfiniteLoader(1000);
		this.messageManager = new MessageManager();
		this.keyHandler = new KeyPressHandler([{
			key: "enter",
			handler: () => this.sendMessage()
		}]);
	}

	private initPaginator(): void {
		const minMessageSizeInPixels = 60;
		let messagesPerPage =
			Math.round(this.viewportService.height / minMessageSizeInPixels);
		this.paginator = new Paginator(messagesPerPage);
	}

	ngOnInit(): void {
		this.observeRouteParams();
		this.observeMessages();
		this.fetchMessages();
	}

	private observeRouteParams(): void {
		this.activatedRoute.params.subscribe(params => {
			this.chatRoomId = params['chatRoomId'];
			if (this.chatRoomId != null && this.chatRoomId != '') {
				this.memberCount =
					this.chatRoomService.getMemberCount(this.chatRoomId);
				this.chatRoomService.selectChatRoom(this.chatRoomId);
			}
		});
	}

	private observeMessages(): void {
		this.chatService.messages$.subscribe(message => {
			if (message.chatRoomId == this.chatRoomId) {
				this.messageManager.addNewMessage(message);
			}
		});
	}

	private fetchMessages(): void {
		this.loader.startLoad();
		this.chatRoomService
			.fetchMessages(
				this.chatRoomId,
				this.paginator.getNextPage()
			)
			.pipe(finalize(() => this.loader.finishLoad()))
			.subscribe(messages => {
				this.renderMessages(messages)
			});
	}

	private renderMessages(messages: MessageModel[]): void {
		messages.forEach(message => {
			this.messageManager.addOldMessage(message);
		});
	}

	public sendMessage(): void {
		if (this.messageToSend == '') {
			return;
		}

		this.chatService.sendMessage({
			timeStamp: new Date(),
			chatRoomId: this.chatRoomId,
			authorName: this.userService.user.username,
			authorAvatarUri: this.userService.user.avatarUri,
			content: this.messageToSend
		});

		this.messageToSend = '';
	}

	public scrollThresholdReached(): void {
		this.fetchMessages();
	}

	public navigateBack(): void {
		this.location.back();
	}
}

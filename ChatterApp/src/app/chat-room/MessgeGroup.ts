import { MessageModel } from "../../types/message-model";

type MessageViewModel = MessageModel & {
	isEarliest: boolean,
	isLatest: boolean
}

export class MessageGroup {

	public author: string;
	public messages: MessageViewModel[] = [];

	constructor(message: MessageModel) {
		this.author = message.authorName;
		this.addNewMessage(message);
	}

	public addOldMessage(message: MessageModel): void {
		if (this.author == message.authorName) {
			this.addEarliestMessage(message);
		}
	}

	public addNewMessage(message: MessageModel): void {
		if (this.author == message.authorName) {
			this.addLatestMessage(message);
		}
	}

	private addEarliestMessage(message: MessageModel): void {
		let prevEarliest = this.messages[this.messages.length - 1];
		if (prevEarliest) {
			prevEarliest.isEarliest = false;
		}

		let viewMessage = message as MessageViewModel;
		viewMessage.isLatest = this.messages.length == 0;
		viewMessage.isEarliest = true;

		this.messages.push(viewMessage);
	}

	private addLatestMessage(message: MessageModel): void {
		let prevLatest = this.messages[0];
		if (prevLatest) {
			prevLatest.isLatest = false;
		}

		let viewMessage = message as MessageViewModel;
		viewMessage.isLatest = true;
		viewMessage.isEarliest = this.messages.length == 0;

		this.messages.unshift(viewMessage);
	}
}

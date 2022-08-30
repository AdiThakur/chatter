import { MessageModel } from "../../types/message-model";
import { MessageViewModel } from "../../types/message-view-model";

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
		let prevEarliestIndex = this.messages.length - 1;
		if (prevEarliestIndex >= 0) {
			this.messages[prevEarliestIndex] = {
				...(this.messages[prevEarliestIndex]), isEarliest: false
			};
		}

		let viewMessage = message as MessageViewModel;
		viewMessage.isLatest = this.messages.length == 0;
		viewMessage.isEarliest = true;

		this.messages.push(viewMessage);
	}

	private addLatestMessage(message: MessageModel): void {
		let prevLatest = this.messages[0];
		if (prevLatest) {
			this.messages[0] = {
				...this.messages[0], isLatest: false
			};
		}

		let viewMessage = message as MessageViewModel;
		viewMessage.isLatest = true;
		viewMessage.isEarliest = this.messages.length == 0;

		this.messages.unshift(viewMessage);
	}
}

import { MessageGroup } from "./MessgeGroup";
import { MessageModel } from "../../types/message-model";

export class MessageManager {

	public groups: MessageGroup[] = [];

	constructor() {}

	public addOldMessage(message: MessageModel): void {
		let earliestGroup = this.groups[this.groups.length - 1];

		if (earliestGroup == undefined ||
			earliestGroup.author != message.authorName) {
			earliestGroup = new MessageGroup(message);
			this.groups.push(earliestGroup);
		} else {
			earliestGroup.addOldMessage(message);
		}
	}

	public addNewMessage(message: MessageModel): void {
		let latestGroup = this.groups[0];

		if (latestGroup == undefined ||
			latestGroup.author != message.authorName) {
			latestGroup = new MessageGroup(message);
			this.groups.unshift(latestGroup);
		} else {
			latestGroup.addNewMessage(message);
		}
	}
}

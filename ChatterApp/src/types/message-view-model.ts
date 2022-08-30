import { MessageModel } from "./message-model";

export type MessageViewModel = MessageModel & {
	isEarliest: boolean,
	isLatest: boolean
}

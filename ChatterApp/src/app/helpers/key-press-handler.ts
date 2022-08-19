type VoidFunc = () => void;

export class KeyPressHandler {

	private keysToHandlers = new Map<string, VoidFunc>();

	constructor(keysAndHandlers: [{ key: string, handler: VoidFunc }]) {
		keysAndHandlers.forEach(({ key, handler}) => {
			this.keysToHandlers.set(key.toLowerCase(), handler);
		});
	}

	public handleKeyPress(event: KeyboardEvent): void {
		let keyPressed = event.key.toLowerCase();
		let handler = this.keysToHandlers.get(keyPressed);
		if (handler != undefined) {
			handler();
		}
	}
}

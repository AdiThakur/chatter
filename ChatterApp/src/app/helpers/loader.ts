import { of, Subject } from "rxjs";
import { delay } from "rxjs/operators";

abstract class Loader {

	protected itemsLoading = 0;

	public startLoad(itemsToLoad?: number): void {
		if (itemsToLoad != undefined) {
			this.itemsLoading = itemsToLoad;
		} else {
			this.itemsLoading++;
		}
	}

	public abstract finishLoad(): void;
}

export class FiniteLoader extends Loader {

	private doneLoading = new Subject<void>();
	public doneLoading$ = this.doneLoading.asObservable();

	public finishLoad(): void {
		if (this.itemsLoading > 0) {
			this.itemsLoading--;
		}
		if (this.itemsLoading == 0) {
			this.doneLoading.next();
		}
	}
}

export class InfiniteLoader extends Loader {

	constructor(private minLoadingDelayInMs?: number) {
		super();
	}

	public finishLoad(): void {
		if (!this.minLoadingDelayInMs) {
			this.decrementItemsLoading();
		} else {
			of(true)
				.pipe(delay(this.minLoadingDelayInMs))
				.subscribe(() => {
					this.decrementItemsLoading();
				});
		}
	}

	private decrementItemsLoading(): void {
		if (this.itemsLoading > 0) {
			this.itemsLoading--;
		}
	}

	public isLoading(): boolean {
		return this.itemsLoading > 0;
	}
}

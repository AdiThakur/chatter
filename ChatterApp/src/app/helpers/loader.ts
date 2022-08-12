import { Subject } from "rxjs";

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
	public finishLoad(): void {
		if (this.itemsLoading > 0) {
			this.itemsLoading--;
		}
	}

	public isLoading(): boolean {
		return this.itemsLoading > 0;
	}
}

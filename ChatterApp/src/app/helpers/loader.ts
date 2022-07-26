import { Subject } from "rxjs";

export class Loader {

	private itemsLoading = 0;
	private doneLoading = new Subject<void>();
	public doneLoading$ = this.doneLoading.asObservable();

	public startLoad(itemsToLoad?: number): void {
		if (itemsToLoad != undefined) {
			this.itemsLoading = itemsToLoad;
		} else {
			this.itemsLoading++;
		}
	}

	public finishLoad(): void {
		if (this.itemsLoading > 0) {
			this.itemsLoading--;
		}
		if (this.itemsLoading == 0) {
			this.doneLoading.next();
		}
	}
}

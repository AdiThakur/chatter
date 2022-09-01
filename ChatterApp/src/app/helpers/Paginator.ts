export type PageDetails = {
	offset: number,
	itemsPerPage: number
}

export class Paginator {

	private offset = 0;
	private readonly itemsPerPage;

	constructor(itemsPerPage: number) {
		this.itemsPerPage = itemsPerPage;
	}

	public getNextPage(): PageDetails {
		let page = { offset: this.offset, itemsPerPage: this.itemsPerPage };
		this.offset += this.itemsPerPage;
		return page;
	}
}

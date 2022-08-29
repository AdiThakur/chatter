export type PageDetails = {
	offset: number,
	count: number
}

export class Paginator {

	private offset = 0;
	private count = 0;

	constructor(count: number) {
		this.count = count;
	}

	public getNextPage(): PageDetails {
		let page = { offset: this.offset, count: this.count };
		this.offset += this.count;
		return page;
	}
}

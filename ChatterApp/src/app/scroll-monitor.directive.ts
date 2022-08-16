import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { interval, Subject, Subscription } from "rxjs";
import { debounce } from "rxjs/operators";

@Directive({
	selector: '[scroll-monitor]'
})
export class ScrollMonitorDirective implements OnInit, OnDestroy {

	private scrollSubject = new Subject<void>();
	private subscription: null  | Subscription = null;

	@Input()
	public scrollThreshold = 10;

	@Input()
	public throttleInMs = 100;

	@Output()
	public onScrollThresholdReached = new EventEmitter<void>();

	@HostListener('scroll', [])
	public onScroll(): void {
		this.scrollSubject.next();
	}

	constructor(private elemRef: ElementRef) {}

	ngOnInit(): void {
		this.subscription = this.scrollSubject
			.pipe(debounce(() => interval(this.throttleInMs)))
			.subscribe(() => {
				let percentScrolledFromTop = this.calculateScrollPercentage();
				if (percentScrolledFromTop <= this.scrollThreshold) {
					this.onScrollThresholdReached.emit();
				}
			});
	}

	private calculateScrollPercentage(): number {
		let currentScroll = this.elemRef.nativeElement.scrollTop;
		let maxScroll = this.elemRef.nativeElement.scrollHeight - this.elemRef.nativeElement.clientHeight;
		let percent = Math.abs((currentScroll / Math.max(maxScroll, 1)));
		percent = Math.max( percent, 0 );
		percent = Math.min( percent, 1 );
		console.log(100 - Math.round(percent * 100))

		return 100 - Math.round(percent * 100);
	}

	ngOnDestroy(): void {
		if (this.subscription != null) {
			this.subscription.unsubscribe();
		}
	}
}

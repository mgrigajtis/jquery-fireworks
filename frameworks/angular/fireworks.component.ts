import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

declare const Fireworks: {
  createFireworks: (element: HTMLElement, options?: {
    opacity?: number;
    width?: number;
    height?: number;
  }) => { destroy: () => void };
};

@Component({
  selector: 'app-fireworks',
  template: '<div #host class="fireworks-host"></div>'
})
export class FireworksComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;
  @Input() options?: { opacity?: number; width?: number; height?: number };

  private instance: { destroy: () => void } | null = null;

  ngAfterViewInit(): void {
    if (typeof Fireworks !== 'undefined' && Fireworks.createFireworks) {
      this.instance = Fireworks.createFireworks(this.host.nativeElement, this.options || {});
    }
  }

  ngOnDestroy(): void {
    if (this.instance) {
      this.instance.destroy();
    }
  }
}

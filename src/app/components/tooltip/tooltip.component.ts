import { Component, Directive, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';

@Directive({
  selector: '.tooltip-container'
})
export class TooltipContainerDirective {
}

@Component({
  template: `
    <div class="tooltip-container" [ngStyle]="{top: top}">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .tooltip-container {
        background-color: black;
        color: #fff;
        display: inline-block;
        padding: 0.5em;
        position: absolute;
      }
    `
  ]
})
export class TooltipComponent implements OnInit {
  top: string;
  @ViewChild(TooltipContainerDirective, { read: ElementRef }) private tooltipContainer;

  constructor( @Inject('tooltipConfig') private config) {
  }

  ngOnInit() {
    const { top } = this.config.host.getBoundingClientRect();
    const { height } = this.tooltipContainer.nativeElement.getBoundingClientRect();
    this.top = `${top - height}px`;
  }

}

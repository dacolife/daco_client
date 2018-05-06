import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, HostListener, Injector, Input, ReflectiveInjector, Renderer2, TemplateRef, Type, ViewContainerRef, ViewRef } from '@angular/core';
import { TooltipComponent } from './tooltip.component';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {
  // We can pass string, template or component
  @Input('tooltip') content: string | TemplateRef<any> | Type<any>;
  private componentRef: ComponentRef<TooltipComponent>;

  constructor(private element: ElementRef,
    private renderer: Renderer2,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private vcr: ViewContainerRef) {
  }

  @HostListener('mouseenter')
  mouseenter() {
    if (this.componentRef) return;
    const factory = this.resolver.resolveComponentFactory(TooltipComponent);
    const injector = ReflectiveInjector.resolveAndCreate([
      {
        provide: 'tooltipConfig',
        useValue: {
          host: this.element.nativeElement
        }
      }
    ]);
    this.componentRef = this.vcr.createComponent(factory, 0, injector, this.generateNgContent());
  }

  generateNgContent() {
    if (typeof this.content === 'string') {
      const element = this.renderer.createText(this.content);
      return [[element]];
    }

    if (this.content instanceof TemplateRef) {
      const viewRef = this.content.createEmbeddedView({});
      return [viewRef.rootNodes];
    }

    // Else it's a component
    const factory = this.resolver.resolveComponentFactory(this.content);
    const viewRef = factory.create(this.injector);
    return [[viewRef.location.nativeElement]];
  }

  @HostListener('mouseout')
  mouseout() {
    this.destroy();
  }

  destroy() {
    this.componentRef && this.componentRef.destroy();
    this.componentRef = null;
  }

  ngOnDestroy() {
    this.destroy();
  }

}

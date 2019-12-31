import { Directive, ElementRef, Input, OnInit, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appIconSvg]'
})
export class IconSvgDirective implements OnInit {
  @Input() src: string;
  @Input() size? = 24;
  constructor(private el: ElementRef, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.el.nativeElement.style.display = 'inline-block';
    this.el.nativeElement.style.width = this.size + 'px';
    this.el.nativeElement.style.height = this.size + 'px';
    this.el.nativeElement.style.backgroundSize = 'cover';
    this.el.nativeElement.style.backgroundImage = `url(${this.src})`;
    this.el.nativeElement.style.cursor = 'pointer';
    this.el.nativeElement.style.filter = 'contrast(100%)';
  }

  @HostListener('mouseover')
  onMouseOver() {
    this.el.nativeElement.style.filter = 'contrast(10%)';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.filter = 'contrast(100%)';
  }

}

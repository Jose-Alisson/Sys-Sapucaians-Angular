import { Component, ElementRef, HostListener, Input, ViewChild, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownComponent {

  @ViewChild('wrapper', {static: true})
  wrapper!: ElementRef<HTMLDivElement>

  @Input()
  title: string = ''

  toggleActiveWrapper(){
    this.wrapper.nativeElement.toggleAttribute('active')
  }

  @HostListener('document:click', ['$event'])
  fecharDropdown(event: MouseEvent) {
    const wrapperElement = this.wrapper.nativeElement;
    if(wrapperElement){
      if (!wrapperElement.contains(event.target as HTMLElement)) {
        wrapperElement.removeAttribute('active');
      }
    }
  }
}

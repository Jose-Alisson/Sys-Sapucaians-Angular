import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-auto-concluit',
  templateUrl: './auto-concluit.component.html',
  styleUrls: ['./auto-concluit.component.scss'],
})
export class AutoConcluitComponent implements AfterViewInit {
  @Input()
  autoValues: any[] = [];

  @Input()
  inputElement?: HTMLInputElement;

  @ViewChild('autoList', { static: true })
  autoList!: ElementRef<HTMLUListElement>;

  values: any[] = [];

  public setAuto() {
    let auto: any[] = [];

    this.autoValues.forEach((value) => {
      let text = this.inputElement?.value;



      if (
        value['index'] === text ||
        ((value['index'] as string) ?? '').toLowerCase().includes(text?.toLowerCase() ?? '') ||
        ((value['indexName'] as string) ?? '').toLowerCase().includes(text?.toLowerCase() ?? '')) {
        auto.push(value);
      }
    });

    if (this.autoValues.length === 0) {
      this.isActive = false;
    }

    this.values = auto;
  }

  isActive = false;

  public setActive() {
    this.isActive = true;
  }

  ngAfterViewInit(): void {}

  @HostListener('document:click', ['$event'])
  desactive(event: MouseEvent) {
    if (!this.inputElement?.contains(event.target as Node)) {
      this.isActive = false;
    }
  }

  setValue(item: any) {
    console.log(item);
    if (this.inputElement) {
      console.log(item);
      this.inputElement.value = item['index'];
    }
  }
}

@Directive({
  selector: '[auto-focus]',
})
export class FocusDirective {
  @Output() focusChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('focus', ['$event'])
  onFocus(event: Event) {
    this.focusChange.emit(true);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event) {
    this.focusChange.emit(false);
  }
}

function name(params: string) {}

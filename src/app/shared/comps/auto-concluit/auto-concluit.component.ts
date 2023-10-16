import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, of, async } from 'rxjs';

@Component({
  selector: 'app-auto-concluit',
  templateUrl: './auto-concluit.component.html',
  styleUrls: ['./auto-concluit.component.scss'],
})
export class AutoConcluitComponent implements OnInit, AfterViewInit {
  @Input()
  aotoValuesObser$?: Observable<any[]>;

  @Input()
  include: boolean = false;

  @Input()
  autoValues: any[] = [];

  @Input()
  inputElement?: HTMLInputElement;

  @ViewChild('autoList', { static: true })
  autoList!: ElementRef<HTMLUListElement>;

  values: any[] = [];

  ngOnInit(): void {}

  public setAuto() {
    let auto: any[] = [];

    this.autoValues.forEach((value) => {
      let text = this.inputElement?.value;
      if (
        value['index'] === text ||
        ((value['index'] as string) ?? '')
          .toLowerCase()
          .includes(text?.toLowerCase() ?? '') ||
        ((value['indexName'] as string) ?? '')
          .toLowerCase()
          .includes(text?.toLowerCase() ?? '')
      ) {
        auto.push(value);
      }
    });

    if ((this.autoValues as []).length === 0) {
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

  separacao(item: any) {
    if (
      (item.index != null &&
      item.index != undefined &&
      item.index != '') && (
      item.indexName != null &&
      item.indexName != undefined &&
      item.indexName != '')
    ) {

      return ' '
    }

    return '-'
  }

  setValue(item: any) {
    if (this.inputElement) {
      if (this.include) {
        this.inputElement.value += item['index'];
      } else {
        this.inputElement.value = item['index'];
      }
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

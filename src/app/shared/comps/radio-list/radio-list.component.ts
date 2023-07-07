import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { RadioComponent, RadioService } from '../radio/radio.component';

@Component({
  selector: 'app-radio-list',
  templateUrl: './radio-list.component.html',
  styleUrls: ['./radio-list.component.scss'],
})
export class RadioListComponent implements AfterContentInit {
  @ContentChildren(RadioComponent)
  radiosElement!: QueryList<RadioComponent>;

  @Input()
  valueCheked: any;

  @Input()
  uncheck = false

  values: any[] = [];

  constructor(private radioService: RadioService) {
    this.radioService.radioChange.subscribe((event: RadioComponent) => {
      if (this.radiosElement) {
        this.radiosElement.forEach((radio, index) => {
          if (radio.name === event.name && radio !== event) {
            radio.removeChecked();
          }
        });
        this.setValues();
      }
    });
  }

  ngAfterContentInit(): void {
    if (this.radiosElement) {
      if (this.valueCheked != undefined) {
        this.radiosElement.forEach((radio, index) => {
          radio.removeChecked()
          if (radio.value === this.valueCheked) {
            radio.setChecked();
          }
        });
      } else {
        this.radiosElement.get(0)?.setChecked()
      }
    }
  }

  catchOption(event: any) {
    console.log(event);
  }

  setValues() {
    let values: any[] = [];
    if (this.radiosElement) {
      this.radiosElement
        .filter((radio) => radio.isChecked())
        .forEach((radio) => {
          values.push({name: radio.name, value: radio.value});
        });
    }

    this.values = values;
  }
}

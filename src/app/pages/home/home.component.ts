import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    let sideLeft = document.querySelector('.side-left')
    let a = sideLeft?.querySelector('a')
    let img = sideLeft?.querySelector('img')

    img?.style.setProperty('top','' + (a?.offsetTop! + a?.offsetHeight!) + 'px')
    console.log(a?.offsetTop! + a?.offsetHeight!)


  }

  ngOnInit(): void {
  }

}

import {
  ActivatedRoute,
  ActivationEnd,
  NavigationEnd,
  Router,
  Routes,
} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { appRoutes } from '../app.module';
import { filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  title: string = 'home';

  array:string[] = []

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => activatedRoute))
      .pipe(
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        })
      )
      .pipe(switchMap((route) => route.data))
      .subscribe((event) => {
        this.title = event['title']
      });
  }

  ngOnInit(): void {}

  merge(){
    document.querySelector('.menu-burguer')?.classList.toggle('change')
  }
}

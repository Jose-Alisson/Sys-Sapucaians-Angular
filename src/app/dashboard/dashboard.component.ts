import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';
import { SignInService } from '../shared/services/sign-in.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  title: string = 'home';

  array: string[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private signIn: SignInService ) {

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
        this.title = event['title'];
      });
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    let menuburguer = document.querySelector('.menu-burguer');
    let menu = document.querySelector('.menu-items');
    menu?.querySelectorAll('.li-nav').forEach((a) => {
      a.addEventListener('click', function () {
        if (menuburguer?.classList.contains('change')) {
          menuburguer?.classList.remove('change');
        }
      });
    });

    menu?.querySelectorAll('li').forEach((li) => {
      li.addEventListener('click', function () {
        menu?.querySelectorAll('li').forEach((data) => {
          if (data.classList.contains('actived')) {
            data.classList.remove('actived');
          }
        });
        if (!li.classList.contains('actived')) {
          li.classList.add('actived');
        }
      });
    });
  }

  merge() {
    document.querySelector('.menu-burguer')?.classList.toggle('change');
  }
}

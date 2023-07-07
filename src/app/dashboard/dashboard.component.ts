import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  ChildActivationEnd,
  Data,
  NavigationEnd,
  Route,
  Router,
  Routes,
} from '@angular/router';
import { data, event } from 'jquery';
import { Observable, Subscription, filter, map, of, switchMap } from 'rxjs';
import { SignService } from '../shared/services/sign-service.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  sidebarClose = false;
  menuBarClose = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sign: SignService
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.menuBarClose = true
    })
  }

  ngAfterViewInit() {}

  toggleActiveSideBar() {
    this.sidebarClose = !this.sidebarClose;
  }

  toggleActiveMenuBar() {
    this.menuBarClose = !this.menuBarClose;
  }

  typeAuthIsAdm(){
    return this.sign.auth.typeRule === "ADMIN"
  }
}

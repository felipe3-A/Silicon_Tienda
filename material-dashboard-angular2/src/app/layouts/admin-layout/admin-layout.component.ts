import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from "jquery";
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor( public location: Location, private router: Router) {}

  ngOnInit() {
    const isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

    if (isWindows && !document.getElementsByTagName('body')[0].classList.contains('sidebar-mini')) {
      // Si estamos en Windows, activamos la función de perfectScrollbar
      document.getElementsByTagName('body')[0].classList.add('perfect-scrollbar-on');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('perfect-scrollbar-off');
    }

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url !== this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (event instanceof NavigationEnd) {
        if (event.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else {
          window.scrollTo(0, 0);
        }
      }
    });

    const window_width = $(window).width();
    let $sidebar = $('.sidebar');
    let $sidebar_responsive = $('body > .navbar-collapse');
    let $sidebar_img_container = $sidebar.find('.sidebar-background');

    if (window_width > 767) {
      if ($('.fixed-plugin .dropdown').hasClass('show-dropdown')) {
        $('.fixed-plugin .dropdown').addClass('open');
      }
    }

    $('.fixed-plugin a').click(function (event) {
      // Si hacemos clic en el interruptor, detenemos la propagación del evento
      if ($(this).hasClass('switch-trigger')) {
        if (event.stopPropagation) {
          event.stopPropagation();
        } else if (window.event) {
          window.event.cancelBubble = true;
        }
      }
    });

    $('.fixed-plugin .badge').click(function () {
      let $full_page_background = $('.full-page-background');
      $(this).siblings().removeClass('active');
      $(this).addClass('active');

      var new_color = $(this).data('color');
      if ($sidebar.length !== 0) {
        $sidebar.attr('data-color', new_color);
      }

      if ($sidebar_responsive.length !== 0) {
        $sidebar_responsive.attr('data-color', new_color);
      }
    });

    $('.fixed-plugin .img-holder').click(function () {
      let $full_page_background = $('.full-page-background');
      $(this).parent('li').siblings().removeClass('active');
      $(this).parent('li').addClass('active');

      var new_image = $(this).find("img").attr('src');
      if ($sidebar_img_container.length !== 0) {
        $sidebar_img_container.fadeOut('fast', function () {
          $sidebar_img_container.css('background-image', 'url("' + new_image + '")');
          $sidebar_img_container.fadeIn('fast');
        });
      }

      if ($full_page_background.length !== 0) {
        $full_page_background.fadeOut('fast', function () {
          $full_page_background.css('background-image', 'url("' + new_image + '")');
          $full_page_background.fadeIn('fast');
        });
      }

      if ($sidebar_responsive.length !== 0) {
        $sidebar_responsive.css('background-image', 'url("' + new_image + '")');
      }
    });
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  isMaps(path: string): boolean {
    const titlee = this.location.prepareExternalUrl(this.location.path());
    return titlee.indexOf(path) !== -1;
  }
  

  runOnRouteChange(): void {
    if (window.matchMedia('(min-width: 960px)').matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector('.main-panel');
      if (elemMainPanel) { // Verificar si el elemento existe
        const ps = new PerfectScrollbar(elemMainPanel);
        ps.update();
      }
    }
  }

  isMac(): boolean {
    return navigator.platform.toUpperCase().includes('MAC') || navigator.platform.toUpperCase().includes('IPAD');
  }
}

import { UtilsService } from './../../service/utils.service';
import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { AuthService } from '@app/pages/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<any>();

  isAdmin = null;
  isLogged = false;

  @Output() toggleSidenav = new EventEmitter<void>();

  constructor( private authService: AuthService,
               private utilsService: UtilsService) { }

  ngOnInit(): void {

    this.authService.isLogged
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => this.isLogged = res)

    this.authService.isAdmin$
      .pipe(takeUntil(this.destroy$))
      .subscribe( (res: any) => {
        this.isAdmin = res;
      }
    );

  }

  ngOnDestroy(): void {

    this.destroy$.next({});
    this.destroy$.complete();

  }

  onToggleSidenav(): void {

    this.toggleSidenav.emit();

  }

  onLogout(): void {

    this.authService.logout();
    this.utilsService.openSidebar(false);

  }

}

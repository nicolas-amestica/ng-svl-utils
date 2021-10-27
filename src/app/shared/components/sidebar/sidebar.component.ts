import { UtilsService } from './../../service/utils.service';
import { AuthService } from '@auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor( private authService: AuthService,
               private utilsService: UtilsService) { }

  ngOnInit(): void {
  }

  onExit(): void {

    this.authService.logout();
    this.utilsService.openSidebar(false);

  }

}

import {Component, OnInit} from '@angular/core';

import {MenuItem, SharedModule} from "primeng/api";
import {MenubarModule} from "primeng/menubar";

import {NgOptimizedImage} from "@angular/common";

import {ChipModule} from "primeng/chip";
import {AuthService} from "../../providers/auth.service";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    ChipModule,
    ButtonModule,
    NgOptimizedImage

  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;
  userName: string = '';
  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.loadUserDetails();
    this.items = [
      {
        label: 'Dipendenti',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Nuovo Dipendente',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['/nuovo-dipendente'] // Aggiungi il percorso di navigazione desiderato
          },
          {
            label: 'Lista Dipendenti',
            icon: 'pi pi-fw pi-ellipsis-v',
            routerLink: ['/lista-dipendenti'] // Aggiungi il percorso di navigazione desiderato
          },
        ]
      },
      {
        label: 'Commesse',
        icon: 'pi pi-fw pi-table',
        items: [
          {
            label: 'Nuova Commessa',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['/nuova-commessa'] // Aggiungi il percorso di navigazione desiderato
          },
          {
            label: 'Lista Commesse',
            icon: 'pi pi-fw pi-ellipsis-v',
            routerLink: ['/lista-commesse'] // Aggiungi il percorso di navigazione desiderato
          },
        ]
      },
      {
        label: 'Impostazioni',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Comuni',
            icon: 'pi pi-fw pi-plus',
            routerLink: ['/comuni'] // Aggiungi il percorso di navigazione desiderato
          },
        ]
      },
      // Aggiungi altri elementi del menu come necessario
    ];
  }

  loadUserDetails() {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.userName = `${userDetails.name} ${userDetails.surname}`;
    }
  }
}

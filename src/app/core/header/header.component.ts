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
  role: string = '';
  constructor(public authService: AuthService) {}
  ngOnInit() {
    this.loadUserDetails();
    this.setupMenu(this.role);
  }

  loadUserDetails() {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.userName = `${userDetails.name} ${userDetails.surname}`;
      this.role = userDetails.role
    }
  }

  setupMenu(role: string) {
    if (role === 'dipendente') {
      this.items = [
        {
          label: 'Attività',
          icon: 'pi pi-fw pi-table',
          items: [
            {
              label: 'Lista Attività',
              icon: 'pi pi-fw pi-ellipsis-v',
              routerLink: ['/lista-attivita']
            }
          ]
        }
      ];
    }
    if (role != 'dipendente'){
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
          label: 'Dashboard',
          icon: 'pi pi-fw pi-euro',
          routerLink: ['/dashboard']

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
          routerLink:['/lista-impostazioni'],
          items: [
            {
              label: 'Comuni',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/comuni'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Oggetto',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/oggetto'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Spese Postali',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/spese-postali'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Tipo Atto',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/tipo-atto'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Tipo Ritiro',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/tipo-ritiro'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Tipo Spedizione',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/tipo-spedizione'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Tipo Stampa',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/tipo-stampa'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Vettore Postale',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/vettore-postale'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Tipo Commessa',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/tipo-commessa'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Misura PNRR',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/misura_pnrr'] // Aggiungi il percorso di navigazione desiderato
            },
            {
              label: 'Attività',
              icon: 'pi pi-fw pi-plus',
              routerLink: ['/attivita'] // Aggiungi il percorso di navigazione desiderato
            },
          ]
        },
        // Aggiungi altri elementi del menu come necessario
      ];
    }
  }
}


import { Component } from '@angular/core';
import {ToolbarModule} from "primeng/toolbar";
import {AvatarModule} from "primeng/avatar";
import {SharedModule} from "primeng/api";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    ToolbarModule,
    AvatarModule,
    SharedModule
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  public year: number; // Anno attuale per la visualizzazione del copyright

  constructor() {
    this.year = new Date ().getFullYear (); // Anno attuale per il copyright
  }
}

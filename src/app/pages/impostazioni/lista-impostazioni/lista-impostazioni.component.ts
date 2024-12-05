import { Component } from '@angular/core';
import {TabViewModule} from "primeng/tabview";
import {ComuniComponent} from "../comuni/comuni.component";
import {OggettoComponent} from "../oggetto/oggetto.component";
import {SpesePostaliComponent} from "../spese-postali/spese-postali.component";
import {TipoAttoComponent} from "../tipo-atto/tipo-atto.component";
import {TipoRitiroComponent} from "../tipo-ritiro/tipo-ritiro.component";
import {TipoSpedizioneComponent} from "../tipo-spedizione/tipo-spedizione.component";
import {TipoStampaComponent} from "../tipo-stampa/tipo-stampa.component";
import {VettorePostaleComponent} from "../vettore-postale/vettore-postale.component";
import {MisuraPnrrComponent} from "../misura-pnrr/misura-pnrr.component";
import {TipoCommessaComponent} from "../tipo-commessa/tipo-commessa.component";
import {AttivitaComponent} from "../attivita/attivita.component";
import {TempiFatturazioneComponent} from "../tempi-fatturazione/tempi-fatturazione.component";

@Component({
  selector: 'app-lista-impostazioni',
  standalone: true,
  imports: [
    TabViewModule,
    ComuniComponent,
    OggettoComponent,
    SpesePostaliComponent,
    TipoAttoComponent,
    TipoRitiroComponent,
    TipoSpedizioneComponent,
    TipoStampaComponent,
    VettorePostaleComponent,
    MisuraPnrrComponent,
    TipoCommessaComponent,
    AttivitaComponent,
    TempiFatturazioneComponent
  ],
  templateUrl: './lista-impostazioni.component.html',
  styleUrl: './lista-impostazioni.component.css'
})
export class ListaImpostazioniComponent {

}

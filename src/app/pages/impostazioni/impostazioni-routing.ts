import {Routes} from "@angular/router";
import {ListaImpostazioniComponent} from "./lista-impostazioni/lista-impostazioni.component";
import {ComuniComponent} from "./comuni/comuni.component";
import {NuovoComuneComponent} from "./comuni/nuovo-comune/nuovo-comune.component";
import {ModificaComuneComponent} from "./comuni/modifica-comune/modifica-comune.component";
import {TempiFatturazioneComponent} from "./tempi-fatturazione/tempi-fatturazione.component";
import {NuovoTempoComponent} from "./tempi-fatturazione/nuovo-tempo/nuovo-tempo.component";
import {ModificaTempoComponent} from "./tempi-fatturazione/modifica-tempo/modifica-tempo.component";
import {TipologiaAppaltoComponent} from "./tipologia-appalto/tipologia-appalto.component";
import {NuovoAppaltoComponent} from "./tipologia-appalto/nuovo-appalto/nuovo-appalto.component";
import {ModificaAppaltoComponent} from "./tipologia-appalto/modifica-appalto/modifica-appalto.component";
import {OggettoComponent} from "./oggetto/oggetto.component";
import {NuovoOggettoComponent} from "./oggetto/nuovo-oggetto/nuovo-oggetto.component";
import {ModificaOggettoComponent} from "./oggetto/modifica-oggetto/modifica-oggetto.component";
import {SpesePostaliComponent} from "./spese-postali/spese-postali.component";
import {NuoveSpesePostaliComponent} from "./spese-postali/nuove-spese-postali/nuove-spese-postali.component";
import {ModificaSpesePostaliComponent} from "./spese-postali/modifica-spese-postali/modifica-spese-postali.component";
import {TipoAttoComponent} from "./tipo-atto/tipo-atto.component";
import {NuovoTipoAttoComponent} from "./tipo-atto/nuovo-tipo-atto/nuovo-tipo-atto.component";
import {ModificaTipoAttoComponent} from "./tipo-atto/modifica-tipo-atto/modifica-tipo-atto.component";
import {TipoRitiroComponent} from "./tipo-ritiro/tipo-ritiro.component";
import {NuovoTipoRitiroComponent} from "./tipo-ritiro/nuovo-tipo-ritiro/nuovo-tipo-ritiro.component";
import {ModificaTipoRitiroComponent} from "./tipo-ritiro/modifica-tipo-ritiro/modifica-tipo-ritiro.component";
import {TipoSpedizioneComponent} from "./tipo-spedizione/tipo-spedizione.component";
import {NuovoTipoSpedizioneComponent} from "./tipo-spedizione/nuovo-tipo-spedizione/nuovo-tipo-spedizione.component";
import {
  ModificaTipoSpedizioneComponent
} from "./tipo-spedizione/modifica-tipo-spedizione/modifica-tipo-spedizione.component";
import {TipoStampaComponent} from "./tipo-stampa/tipo-stampa.component";
import {NuovoTipoStampaComponent} from "./tipo-stampa/nuovo-tipo-stampa/nuovo-tipo-stampa.component";
import {ModificaTipoStampaComponent} from "./tipo-stampa/modifica-tipo-stampa/modifica-tipo-stampa.component";
import {VettorePostaleComponent} from "./vettore-postale/vettore-postale.component";
import {NuovoVettorePostaleComponent} from "./vettore-postale/nuovo-vettore-postale/nuovo-vettore-postale.component";
import {
  ModificaVettorePostaleComponent
} from "./vettore-postale/modifica-vettore-postale/modifica-vettore-postale.component";
import {TipoCommessaComponent} from "./tipo-commessa/tipo-commessa.component";
import {NuovoTipoCommessaComponent} from "./tipo-commessa/nuovo-tipo-commessa/nuovo-tipo-commessa.component";
import {ModificaTipoCommessaComponent} from "./tipo-commessa/modifica-tipo-commessa/modifica-tipo-commessa.component";
import {MisuraPnrrComponent} from "./misura-pnrr/misura-pnrr.component";
import {NuovoMisuraPnrrComponent} from "./misura-pnrr/nuovo-misura-pnrr/nuovo-misura-pnrr.component";
import {ModificaMisuraPnrrComponent} from "./misura-pnrr/modifica-misura-pnrr/modifica-misura-pnrr.component";
import {AttivitaComponent} from "./attivita/attivita.component";
import {NuovaAttivitaComponent} from "./attivita/nuova-attivita/nuova-attivita.component";
import {ModificaAttivitaComponent} from "./attivita/modifica-attivita/modifica-attivita.component";

export const impostazioniRoutes: Routes = [
  //impostazioni
  {path:'lista-impostazioni', component: ListaImpostazioniComponent},
  //comuni
  {path:'comuni', component: ComuniComponent},
  {path:'nuovo-comune', component: NuovoComuneComponent},
  {path:'modifica-comune/:id', component: ModificaComuneComponent},
  //tempo fatturazione
  {path:'tempi', component: TempiFatturazioneComponent},
  {path:'nuovo-tempo', component: NuovoTempoComponent},
  {path:'modifica-tempo/:id', component: ModificaTempoComponent},
  //tipologia appalto
  {path:'tipologia-appalto', component: TipologiaAppaltoComponent},
  {path:'nuovo-appalto', component: NuovoAppaltoComponent},
  {path:'modifica-appalto/:id', component: ModificaAppaltoComponent},
  //oggetto
  {path:'oggetto', component:OggettoComponent},
  {path:'nuovo-oggetto', component: NuovoOggettoComponent},
  {path:'modifica-oggetto/:id', component: ModificaOggettoComponent},
  //spese postali
  {path:'spese-postali', component: SpesePostaliComponent},
  {path:'nuovo-spese-postali', component: NuoveSpesePostaliComponent},
  {path:'modifica-spese-postali/:id', component: ModificaSpesePostaliComponent},
  //tipo atto
  {path:'tipo-atto', component:TipoAttoComponent},
  {path:'nuovo-tipo-atto', component: NuovoTipoAttoComponent},
  {path:'modifica-tipo-atto/:id', component: ModificaTipoAttoComponent},
  //tipo ritiro
  {path:'tipo-ritiro', component: TipoRitiroComponent},
  {path:'nuovo-tipo-ritiro', component: NuovoTipoRitiroComponent},
  {path:'modifica-tipo-ritiro/:id', component: ModificaTipoRitiroComponent},
  //tipo spedizione
  {path:'tipo-spedizione', component: TipoSpedizioneComponent},
  {path:'nuovo-tipo-spedizione', component: NuovoTipoSpedizioneComponent},
  {path:'modifica-tipo-spedizione/:id', component: ModificaTipoSpedizioneComponent},
  //tipo stampa
  {path:'tipo-stampa', component: TipoStampaComponent},
  {path:'nuovo-tipo-stampa', component: NuovoTipoStampaComponent},
  {path:'modifica-tipo-stampa/:id', component: ModificaTipoStampaComponent},
  //vettore postale
  {path:'vettore-postale', component: VettorePostaleComponent},
  {path:'nuovo-vettore-postale', component: NuovoVettorePostaleComponent},
  {path:'modifica-vettore-postale/:id', component: ModificaVettorePostaleComponent},
  //tipo commessa
  {path:'tipo-commessa', component: TipoCommessaComponent},
  {path:'nuovo-tipo-commessa', component: NuovoTipoCommessaComponent},
  {path:'modifica-tipo-commessa/:id', component: ModificaTipoCommessaComponent},
  //misura pnrr
  {path:'misura-pnrr', component: MisuraPnrrComponent},
  {path:'nuovo-misura-pnrr', component: NuovoMisuraPnrrComponent},
  {path:'modifica-misura-pnrr/:id', component: ModificaMisuraPnrrComponent},
  //attivita
  {path:'attivita', component: AttivitaComponent},
  {path:'nuova-attivita', component:NuovaAttivitaComponent},
  {path:'modifica-attivita/:id', component: ModificaAttivitaComponent},


]

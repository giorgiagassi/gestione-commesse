import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/utenti/login/login.component";
import {ListaAttivitaComponent} from "./pages/attivita/lista-attivita/lista-attivita.component";
import {StampaComponent} from "./pages/attivita/attivita-stampa/stampa/stampa.component";
import {NuovaCommessaComponent} from "./pages/commesse/nuova-commessa/nuova-commessa.component";
import {ListaDipendentiComponent} from "./pages/dipendenti/lista-dipendenti/lista-dipendenti.component";
import {NuovoDipendenteComponent} from "./pages/dipendenti/nuovo-dipendente/nuovo-dipendente.component";
import {RegistrazioneComponent} from "./pages/utenti/registrazione/registrazione.component";
import {ListaCommesseComponent} from "./pages/commesse/lista-commesse/lista-commesse.component";
import {ModificaCommessaComponent} from "./pages/commesse/modifica-commessa/modifica-commessa.component";
import {ComuniComponent} from "./pages/impostazioni/comuni/comuni.component";
import {OggettoComponent} from "./pages/impostazioni/oggetto/oggetto.component";
import {SpesePostaliComponent} from "./pages/impostazioni/spese-postali/spese-postali.component";
import {TipoRitiroComponent} from "./pages/impostazioni/tipo-ritiro/tipo-ritiro.component";
import {TipoAttoComponent} from "./pages/impostazioni/tipo-atto/tipo-atto.component";
import {TipoSpedizioneComponent} from "./pages/impostazioni/tipo-spedizione/tipo-spedizione.component";
import {TipoStampaComponent} from "./pages/impostazioni/tipo-stampa/tipo-stampa.component";
import {VettorePostaleComponent} from "./pages/impostazioni/vettore-postale/vettore-postale.component";
import {ListaImpostazioniComponent} from "./pages/impostazioni/lista-impostazioni/lista-impostazioni.component";
import {NuovoComuneComponent} from "./pages/impostazioni/comuni/nuovo-comune/nuovo-comune.component";
import {ModificaComuneComponent} from "./pages/impostazioni/comuni/modifica-comune/modifica-comune.component";
import {NuovoOggettoComponent} from "./pages/impostazioni/oggetto/nuovo-oggetto/nuovo-oggetto.component";
import {ModificaOggettoComponent} from "./pages/impostazioni/oggetto/modifica-oggetto/modifica-oggetto.component";
import {
  NuoveSpesePostaliComponent
} from "./pages/impostazioni/spese-postali/nuove-spese-postali/nuove-spese-postali.component";
import {
  ModificaSpesePostaliComponent
} from "./pages/impostazioni/spese-postali/modifica-spese-postali/modifica-spese-postali.component";
import {NuovoTipoAttoComponent} from "./pages/impostazioni/tipo-atto/nuovo-tipo-atto/nuovo-tipo-atto.component";
import {
  ModificaTipoAttoComponent
} from "./pages/impostazioni/tipo-atto/modifica-tipo-atto/modifica-tipo-atto.component";
import {NuovoTipoRitiroComponent} from "./pages/impostazioni/tipo-ritiro/nuovo-tipo-ritiro/nuovo-tipo-ritiro.component";
import {
  ModificaTipoRitiroComponent
} from "./pages/impostazioni/tipo-ritiro/modifica-tipo-ritiro/modifica-tipo-ritiro.component";
import {
  NuovoTipoSpedizioneComponent
} from "./pages/impostazioni/tipo-spedizione/nuovo-tipo-spedizione/nuovo-tipo-spedizione.component";
import {
  ModificaTipoSpedizioneComponent
} from "./pages/impostazioni/tipo-spedizione/modifica-tipo-spedizione/modifica-tipo-spedizione.component";
import {NuovoTipoStampaComponent} from "./pages/impostazioni/tipo-stampa/nuovo-tipo-stampa/nuovo-tipo-stampa.component";
import {
  ModificaTipoStampaComponent
} from "./pages/impostazioni/tipo-stampa/modifica-tipo-stampa/modifica-tipo-stampa.component";
import {
  NuovoVettorePostaleComponent
} from "./pages/impostazioni/vettore-postale/nuovo-vettore-postale/nuovo-vettore-postale.component";
import {
  ModificaVettorePostaleComponent
} from "./pages/impostazioni/vettore-postale/modifica-vettore-postale/modifica-vettore-postale.component";
import {TipoCommessaComponent} from "./pages/impostazioni/tipo-commessa/tipo-commessa.component";
import {
  NuovoTipoCommessaComponent
} from "./pages/impostazioni/tipo-commessa/nuovo-tipo-commessa/nuovo-tipo-commessa.component";
import {
  ModificaTipoCommessaComponent
} from "./pages/impostazioni/tipo-commessa/modifica-tipo-commessa/modifica-tipo-commessa.component";
import {MisuraPnrrComponent} from "./pages/impostazioni/misura-pnrr/misura-pnrr.component";
import {NuovoMisuraPnrrComponent} from "./pages/impostazioni/misura-pnrr/nuovo-misura-pnrr/nuovo-misura-pnrr.component";
import {
  ModificaMisuraPnrrComponent
} from "./pages/impostazioni/misura-pnrr/modifica-misura-pnrr/modifica-misura-pnrr.component";
import {ModificaStampaComponent} from "./pages/attivita/attivita-stampa/modifica-stampa/modifica-stampa.component";
import {
  ModificaStampaDipendenteComponent
} from "./pages/attivita/attivita-stampa/modifica-stampa-dipendente/modifica-stampa-dipendente.component";
import {DdtComponent} from "./pages/attivita/attivita-stampa/ddt/ddt.component";

export const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  //utenti
  {path:'login', component: LoginComponent},
  {path:'lista-dipendenti', component: ListaDipendentiComponent},
  {path:'nuovo-dipendente', component: NuovoDipendenteComponent},
  {path:'registrazione', component:RegistrazioneComponent},
  //attività
  {path:'lista-attivita/:id', component: ListaAttivitaComponent},
  {path:'stampa/:id', component: StampaComponent},
  {path:'modifica-stampa/:id', component: ModificaStampaComponent},
  {path:'modifica-stampa-dipendente/:id', component: ModificaStampaDipendenteComponent},
  {path:'ddt/:id', component: DdtComponent},

  //commesse
  {path:'lista-commesse', component: ListaCommesseComponent},
  {path:'nuova-commessa', component: NuovaCommessaComponent},
  {path:'modifica-commessa/:id', component:ModificaCommessaComponent},

//impostazioni
  {path:'lista-impostazioni', component: ListaImpostazioniComponent},
  //comuni
  {path:'comuni', component: ComuniComponent},
  {path:'nuovo-comune', component: NuovoComuneComponent},
  {path:'modifica-comune/:id', component: ModificaComuneComponent},
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





];

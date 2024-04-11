import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/utenti/login/login.component";
import {ListaAttivitaComponent} from "./pages/attivita/lista-attivita/lista-attivita.component";
import {StampaComponent} from "./pages/attivita/stampa/stampa.component";
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

export const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path:'lista-attivita/:id', component: ListaAttivitaComponent},
  {path:'stampa', component: StampaComponent},
  {path:'lista-commesse', component: ListaCommesseComponent},
  {path:'nuova-commessa', component: NuovaCommessaComponent},
  {path:'lista-dipendenti', component: ListaDipendentiComponent},
  {path:'nuovo-dipendente', component: NuovoDipendenteComponent},
  {path:'registrazione', component:RegistrazioneComponent},
  {path:'modifica-commessa/:id', component:ModificaCommessaComponent},
  {path:'comuni', component: ComuniComponent},
  {path:'oggetto', component:OggettoComponent},
  {path:'spese-postali', component: SpesePostaliComponent},
  {path:'tipo-atto', component:TipoAttoComponent},
  {path:'tipo-ritiro', component: TipoRitiroComponent},
  {path:'tipo-spedizione', component: TipoSpedizioneComponent},
  {path:'tipo-stampa', component: TipoStampaComponent},
  {path:'vettore-postale', component: VettorePostaleComponent}

];

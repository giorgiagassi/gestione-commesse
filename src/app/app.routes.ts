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

];

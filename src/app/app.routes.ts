import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/utenti/login/login.component";
import {ListaAttivitaComponent} from "./pages/attivita/lista-attivita/lista-attivita.component";
import {StampaComponent} from "./pages/attivita/stampa/stampa.component";
import {NuovaCommessaComponent} from "./pages/commesse/nuova-commessa/nuova-commessa.component";
import {ListaDipendentiComponent} from "./pages/dipendenti/lista-dipendenti/lista-dipendenti.component";
import {NuovoDipendenteComponent} from "./pages/dipendenti/nuovo-dipendente/nuovo-dipendente.component";
import {RegistrazioneComponent} from "./pages/utenti/registrazione/registrazione.component";

export const routes: Routes = [
  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path:'lista-attivita', component: ListaAttivitaComponent},
  {path:'stampa', component: StampaComponent},
  {path:'lista-commesse', component: ListaAttivitaComponent},
  {path:'nuova-commessa', component: NuovaCommessaComponent},
  {path:'lista-dipendenti', component: ListaDipendentiComponent},
  {path:'nuovo-dipendente', component: NuovoDipendenteComponent},
  {path:'registrazione', component:RegistrazioneComponent}

];

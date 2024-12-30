import {Routes} from '@angular/router';
import {LoginComponent} from "./pages/utenti/login/login.component";
import {RegistrazioneComponent} from "./pages/utenti/registrazione/registrazione.component";
import {impostazioniRoutes} from "./pages/impostazioni/impostazioni-routing";
import {dipendentiRoutes} from "./pages/dipendenti/dipendenti-routing";
import {commesseRoutes} from "./pages/commesse/commesse-routing";
import {attivitaRoutes} from "./pages/attivita/attivita-routing";
import {scrivaniaRoutes} from "./pages/scrivania/scrivania-routing";

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  //utenti
  {path: 'login', component: LoginComponent},

  {path: 'registrazione', component: RegistrazioneComponent},


  ...impostazioniRoutes,
  ...dipendentiRoutes,
  ...commesseRoutes,
  ...attivitaRoutes,
  ...scrivaniaRoutes


];

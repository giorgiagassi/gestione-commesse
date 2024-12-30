import {Routes} from "@angular/router";
import {ListaCommesseComponent} from "./lista-commesse/lista-commesse.component";
import {NuovaCommessaComponent} from "./nuova-commessa/nuova-commessa.component";
import {ModificaCommessaComponent} from "./modifica-commessa/modifica-commessa.component";
import {ListaContabilitaComponent} from "./contabilita/lista-contabilita/lista-contabilita.component";
import {NuovaContabilitaComponent} from "./contabilita/nuova-contabilita/nuova-contabilita.component";
import {ModificaContabilitaComponent} from "./contabilita/modifica-contabilita/modifica-contabilita.component";
import {ListaFornitureComponent} from "./forniture/lista-forniture/lista-forniture.component";
import {NuovaFornituraComponent} from "./forniture/nuova-fornitura/nuova-fornitura.component";
import {ModificaFornituraComponent} from "./forniture/modifica-fornitura/modifica-fornitura.component";
import {StampaFornituraComponent} from "./forniture/stampa-fornitura/stampa-fornitura.component";

export const commesseRoutes:Routes = [
  //commesse
  {path:'lista-commesse', component: ListaCommesseComponent},
  {path:'nuova-commessa', component: NuovaCommessaComponent},
  {path:'modifica-commessa/:id', component:ModificaCommessaComponent},
  {path:'lista-contabilita/:id', component: ListaContabilitaComponent},
  {path: 'nuova-contabilita/:id', component:NuovaContabilitaComponent},
  {path:'modifica-contabilita/:id', component:ModificaContabilitaComponent},
  {path:'lista-forniture/:id', component: ListaFornitureComponent},
  {path:'nuova-fornitura/:id', component:NuovaFornituraComponent},
  {path:'modifica-fornitura/:id', component:ModificaFornituraComponent},
  {path:'stampa-fornitura', component:StampaFornituraComponent},
]

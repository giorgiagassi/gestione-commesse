import {Routes} from "@angular/router";
import {ListaDipendentiComponent} from "./lista-dipendenti/lista-dipendenti.component";
import {NuovoDipendenteComponent} from "./nuovo-dipendente/nuovo-dipendente.component";
import {ModificaDipendenteComponent} from "./modifica-dipendente/modifica-dipendente.component";

export const dipendentiRoutes: Routes = [
  {path:'lista-dipendenti', component: ListaDipendentiComponent},
  {path:'nuovo-dipendente', component: NuovoDipendenteComponent},
  {path:'modifica-dipendente/:id', component: ModificaDipendenteComponent},
]

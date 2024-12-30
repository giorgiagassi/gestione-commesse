import {Routes} from "@angular/router";
import {ListaAttivitaComponent} from "./lista-attivita/lista-attivita.component";
import {StampaComponent} from "./attivita-stampa/stampa/stampa.component";
import {AttivitaGenericaComponent} from "./generica/attivita-generica/attivita-generica.component";
import {
  ModificaAttivitaGenericaComponent
} from "./generica/modifica-attivita-generica/modifica-attivita-generica.component";
import {VisualizzaAttivitaComponent} from "./generica/visualizza-attivita/visualizza-attivita.component";
import {ModificaStampaComponent} from "./attivita-stampa/modifica-stampa/modifica-stampa.component";
import {
  ModificaStampaDipendenteComponent
} from "./attivita-stampa/modifica-stampa-dipendente/modifica-stampa-dipendente.component";
import {DdtComponent} from "./attivita-stampa/ddt/ddt.component";

export const attivitaRoutes: Routes = [
  //attività
  {path: 'lista-attivita/:id', component: ListaAttivitaComponent},
  {path: 'lista-attivita', component: ListaAttivitaComponent},
  {path: 'stampa/:id', component: StampaComponent},
  {path: 'nuova-generica/:id', component: AttivitaGenericaComponent},
  {path: 'modifica-generica/:id', component: ModificaAttivitaGenericaComponent},
  {path: 'visualizza-generica/:id', component: VisualizzaAttivitaComponent},
  {path: 'modifica-stampa/:id', component: ModificaStampaComponent},
  {path: 'modifica-stampa-dipendente/:id', component: ModificaStampaDipendenteComponent},
  {path: 'ddt/:id', component: DdtComponent},

]

import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {get, getDatabase, ref, remove} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {ButtonModule} from "primeng/button";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {AuthService} from "../../../providers/auth.service";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-lista-attivita',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    SharedModule,
    TableModule
  ],
  templateUrl: './lista-attivita.component.html',
  styleUrl: './lista-attivita.component.css'
})
export class ListaAttivitaComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  attivitaList:any;
  loading: boolean = false
  role!: string;
  idUtente!:string;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.getCommesseList();
    this.userDetails();
  }
  userDetails(): void {
    this.authService.getUserDetails()
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.role = userDetails.role
      this.idUtente = userDetails.id
    }
  }

  async getCommesseList() {
    const huntersRef = ref(database, 'attivita/attivita-stampa');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Stampa i valori per ogni chiave per comprendere meglio i dati
        Object.keys(data).forEach(key => {
        });

        // Applica il filtro e la mappatura se necessario
        if (this.role === 'dipendente') {
          this.attivitaList = Object.keys(data)
            .filter(key =>
              data[key].dipendenti?.risorse.some((r:any) => r.dipendenti === this.idUtente)
            )
            .map(key => ({ ...data[key], id: key }));
        } else {
          this.attivitaList = Object.keys(data)
            .map(key => ({ ...data[key], id: key }));
        }

        return this.attivitaList;
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }
  }
  editCustomer(customer: any) {
    console.log(customer.id)
    // Qui puoi navigare alla componente di modifica con i dati del cliente
    // per esempio, utilizzando il Router di Angular e passando l'ID del cliente
    this.router.navigate(['/modifica-stampa', customer.id]);
  }
  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `attivita/attivita-stampa/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.attivitaList = this.attivitaList.filter((item: any) => item.id !== customer.id);
      console.log('Commessa eliminato con successo');
    }).catch((error:any) => {
      console.error('Errore durante l/eliminazione della commessa:', error);
    });
  }

  stampaCustomer() {
    const commessaId = this.route.snapshot.paramMap.get('id'); // Assumendo che 'id' sia il nome del parametro nella rotta
    this.router.navigate(['/stampa',  commessaId]);
  }
}

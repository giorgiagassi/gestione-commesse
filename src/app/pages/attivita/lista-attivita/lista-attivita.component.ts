import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {get, getDatabase, ref, remove} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {ButtonModule} from "primeng/button";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
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
  constructor(private router: Router,
              private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.getCommesseList()
  }

  async getCommesseList() {
    const huntersRef = ref(database, 'lista-attivita');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.attivitaList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        console.log('Lista dei attivita:', this.attivitaList);
        return this.attivitaList;
      } else {
        // La lista non è stata trovata nel database
        console.log('Nessuna lista dei attivita trovata nel database.');
        return null;
      }
    } catch (error) {
      // Si è verificato un errore durante il recupero dei dati
      console.error('Errore durante il recupero della lista dei attivita:', error);
      return null;
    }

  }
  editCustomer(customer: any) {
    console.log(customer.id)
    // Qui puoi navigare alla componente di modifica con i dati del cliente
    // per esempio, utilizzando il Router di Angular e passando l'ID del cliente
    this.router.navigate(['/modifica-commessa', customer.id]);
  }
  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `lista-attivita/${customer.id}`);

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
    this.router.navigate(['/stampa'], { state: { commessaId: commessaId } });
  }
}

import {Component, OnInit, ViewChild} from '@angular/core';
import {Button} from "primeng/button";
import {PrimeTemplate} from "primeng/api";
import {Router, RouterLink} from "@angular/router";
import {TableModule} from "primeng/table";
import {get, getDatabase, ref, remove} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-tempi-fatturazione',
  standalone: true,
  imports: [
    Button,
    PrimeTemplate,
    RouterLink,
    TableModule
  ],
  templateUrl: './tempi-fatturazione.component.html',
  styleUrl: './tempi-fatturazione.component.css'
})
export class TempiFatturazioneComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  comuniList:any;
  loading: boolean = false
  constructor(private router: Router,
  ) {
  }

  ngOnInit() {
    this.getCommesseList()
  }

  async getCommesseList() {
    const huntersRef = ref(database, 'impostazioni/tempi-fatturazione');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.comuniList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        console.log('Lista dei comuni:', this.comuniList);
        return this.comuniList;
      } else {
        // La lista non è stata trovata nel database
        console.log('Nessuna lista dei comuni trovata nel database.');
        return null;
      }
    } catch (error) {
      // Si è verificato un errore durante il recupero dei dati
      console.error('Errore durante il recupero della lista dei comuni:', error);
      return null;
    }

  }
  editCustomer(customer: any) {
    console.log(customer.id)
    // Qui puoi navigare alla componente di modifica con i dati del cliente
    // per esempio, utilizzando il Router di Angular e passando l'ID del cliente
    this.router.navigate(['/modifica-tempo', customer.id]);
  }
  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `impostazioni/tempi-fatturazione/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.comuniList = this.comuniList.filter((item: any) => item.id !== customer.id);
      console.log('Comune eliminato con successo');
    }).catch((error:any) => {
      console.error('Errore durante l/eliminazione della comune:', error);
    });
  }
}

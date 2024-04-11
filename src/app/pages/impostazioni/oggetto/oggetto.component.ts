import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {get, getDatabase, ref, remove} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {ButtonModule} from "primeng/button";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";


const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-oggetto',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    SharedModule,
    TableModule
  ],
  templateUrl: './oggetto.component.html',
  styleUrl: './oggetto.component.css'
})
export class OggettoComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  oggettoList:any;
  loading: boolean = false
  constructor(private router: Router,
  ) {
  }

  ngOnInit() {
    this.getCommesseList()
  }

  async getCommesseList() {
    const huntersRef = ref(database, 'impostazioni/oggetto');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.oggettoList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        console.log('Lista dei oggetto:', this.oggettoList);
        return this.oggettoList;
      } else {
        // La lista non è stata trovata nel database
        console.log('Nessuna lista dei oggetto trovata nel database.');
        return null;
      }
    } catch (error) {
      // Si è verificato un errore durante il recupero dei dati
      console.error('Errore durante il recupero della lista dei oggetto:', error);
      return null;
    }

  }
  editCustomer(customer: any) {
    console.log(customer.id)
    // Qui puoi navigare alla componente di modifica con i dati del cliente
    // per esempio, utilizzando il Router di Angular e passando l'ID del cliente
    this.router.navigate(['/modifica-oggetto', customer.id]);
  }
  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `impostazioni/oggetto/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.oggettoList = this.oggettoList.filter((item: any) => item.id !== customer.id);
      console.log('Comune eliminato con successo');
    }).catch((error:any) => {
      console.error('Errore durante l/eliminazione della comune:', error);
    });
  }
}

import {Component, OnInit, ViewChild} from '@angular/core';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import {environment} from "../../../enviroments/enviroments";
import {Router, RouterLink} from "@angular/router";
import {Table, TableModule} from "primeng/table";

const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
import { remove } from 'firebase/database';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
@Component({
  selector: 'app-lista-commesse',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    RouterLink
  ],
  templateUrl: './lista-commesse.component.html',
  styleUrl: './lista-commesse.component.css'
})
export class ListaCommesseComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  commesseList:any;
  loading: boolean = false
  constructor(private router: Router,
  ) {
  }

  ngOnInit() {
    this.getCommesseList()
  }

  async getCommesseList() {
    const huntersRef = ref(database, 'lista-commesse');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.commesseList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        console.log('Lista dei commesse:', this.commesseList);
        return this.commesseList;
      } else {
        // La lista non è stata trovata nel database
        console.log('Nessuna lista dei commesse trovata nel database.');
        return null;
      }
    } catch (error) {
      // Si è verificato un errore durante il recupero dei dati
      console.error('Errore durante il recupero della lista dei commesse:', error);
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
    const customerRef = ref(database, `lista-commesse/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.commesseList = this.commesseList.filter((item: any) => item.id !== customer.id);
      console.log('Commessa eliminato con successo');
    }).catch((error:any) => {
      console.error('Errore durante l/eliminazione della commessa:', error);
    });
  }

  attivitaCustomer(customer: any) {
    console.log(customer.id)
    this.router.navigate(['/lista-attivita', customer.id]);
  }
}

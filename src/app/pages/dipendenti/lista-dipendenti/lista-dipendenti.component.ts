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
  selector: 'app-lista-dipendenti',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    SharedModule,
    TableModule
  ],
  templateUrl: './lista-dipendenti.component.html',
  styleUrl: './lista-dipendenti.component.css'
})
export class ListaDipendentiComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  usersList:any;
  loading: boolean = false
  constructor(private router: Router,
  ) {
  }

  ngOnInit() {
    this.getUSersList()
  }

  async getUSersList() {
    const huntersRef = ref(database, 'users');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.usersList = Object.keys(data).map(key => ({ ...data[key], id: key }));

        return this.usersList;
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }

  }
  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `users/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.usersList = this.usersList.filter((item: any) => item.id !== customer.id);
      console.log('Eliminato con successo');
    }).catch((error:any) => {

    });
  }
  addCustomer(customer: any) {

    this.router.navigate(['/modifica-dipendente',  customer.id]);
  }
}


import {Component, OnInit, ViewChild} from '@angular/core';
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {get, getDatabase, ref, remove} from "firebase/database";
import {Router, RouterLink} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-tipo-stampa',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    SharedModule,
    TableModule
  ],
  templateUrl: './tipo-stampa.component.html',
  styleUrl: './tipo-stampa.component.css'
})
export class TipoStampaComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  tipoStampaList:any;
  loading: boolean = false
  constructor(private router: Router,
  ) {
  }

  ngOnInit() {
    this.getCommesseList()
  }

  async getCommesseList() {
    const huntersRef = ref(database, 'impostazioni/tipo-stampa');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.tipoStampaList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.tipoStampaList;
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
    this.router.navigate(['/modifica-tipo-stampa', customer.id]);
  }
  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `impostazioni/tipo-stampa/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.tipoStampaList = this.tipoStampaList.filter((item: any) => item.id !== customer.id);
    }).catch((error:any) => {
    });
  }
}

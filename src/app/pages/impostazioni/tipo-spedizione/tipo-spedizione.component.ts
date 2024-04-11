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
  selector: 'app-tipo-spedizione',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    SharedModule,
    TableModule
  ],
  templateUrl: './tipo-spedizione.component.html',
  styleUrl: './tipo-spedizione.component.css'
})
export class TipoSpedizioneComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  tipoSpedizioneList:any;
  loading: boolean = false
  constructor(private router: Router,
  ) {
  }

  ngOnInit() {
    this.getCommesseList()
  }

  async getCommesseList() {
    const huntersRef = ref(database, 'impostazioni/tipo-spedizione');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.tipoSpedizioneList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.tipoSpedizioneList;
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
    this.router.navigate(['/modifica-tipo-spedizione', customer.id]);
  }
  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `impostazioni/tipo-spedizione/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.tipoSpedizioneList = this.tipoSpedizioneList.filter((item: any) => item.id !== customer.id);
    }).catch((error:any) => {
    });
  }
}

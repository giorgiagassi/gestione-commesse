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
  selector: 'app-tipo-atto',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    SharedModule,
    TableModule
  ],
  templateUrl: './tipo-atto.component.html',
  styleUrl: './tipo-atto.component.css'
})
export class TipoAttoComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  tipoAttoList:any;
  loading: boolean = false
  constructor(private router: Router,
  ) {
  }

  ngOnInit() {
    this.getCommesseList()
  }

  async getCommesseList() {
    const huntersRef = ref(database, 'impostazioni/tipo-atto');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.tipoAttoList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.tipoAttoList;
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
    this.router.navigate(['/modifica-tipo-atto', customer.id]);
  }
  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `impostazioni/tipo-atto/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.tipoAttoList = this.tipoAttoList.filter((item: any) => item.id !== customer.id);
    }).catch((error:any) => {
    });
  }
}

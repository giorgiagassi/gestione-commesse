import {Component, OnInit, ViewChild} from '@angular/core';
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {get, getDatabase, ref, remove, update} from "firebase/database";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../providers/auth.service";
import {SharedService} from "../../../../providers/shared.service";
import {ButtonModule} from "primeng/button";
import {DatePipe, NgIf} from "@angular/common";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-lista-contabilita',
  standalone: true,
  imports: [
    ButtonModule,
    DatePipe,
    NgIf,
    SharedModule,
    TableModule,
    TagModule,
    ToggleButtonModule,
    FormsModule
  ],
  templateUrl: './lista-contabilita.component.html',
  styleUrl: './lista-contabilita.component.css'
})
export class ListaContabilitaComponent implements OnInit{
@ViewChild('dt1') dt1: any;
  attivitaList:any;
  checked: boolean = false;
  loading: boolean = false
  role!: string;
  idUtente!:string;
  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService
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
    const huntersRef = ref(database, 'contabilita');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const customerId = this.sharedService.getCustomerId(); // Recupera l'ID del cliente

        // Crea una lista temporanea per le attività filtrate
        let tempAttivitaList = [];


          tempAttivitaList = Object.keys(data)
            .map(key => ({ ...data[key], id: key }));

        // Ordinamento dal più recente al meno recente basato su ID
        tempAttivitaList.sort((a, b) => {
          return b.id.localeCompare(a.id);
        });
        // Filtra la lista in base all'ID del cliente sotto la voce commessa, se disponibile
        if (customerId) {
          this.attivitaList = tempAttivitaList.filter((attivita: any) => attivita.commessa === customerId);
        } else {
          this.attivitaList = tempAttivitaList;
        }


console.log(this.attivitaList, 'contabilita')
        return this.attivitaList;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  editCustomer(customer: any) {

    this.router.navigate(['/modifica-contabilita', customer.id]);
  }


  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `contabilita/${customer.id}`);

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
    this.router.navigate(['/nuova-contabilita/',  commessaId]);
    console.log(commessaId, 'commessaID')
  }

  togglePagamento(customer: any, event: any): void {
    const pagato = event.checked;
    const customerRef = ref(database, `contabilita/${customer.id}/contabilita`);
    update(customerRef, { pagato }).then(() => {
      console.log('Pagamento aggiornato con successo');
    }).catch((error: any) => {
      console.error('Errore durante l\'aggiornamento del pagamento:', error);
    });
  }

}


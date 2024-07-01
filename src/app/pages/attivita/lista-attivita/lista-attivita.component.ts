import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {get, getDatabase, ref, remove} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {ButtonModule} from "primeng/button";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {AuthService} from "../../../providers/auth.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {SharedService} from "../../../providers/shared.service";
import {TagModule} from "primeng/tag";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-lista-attivita',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    SharedModule,
    TableModule,
    NgIf,
    NgForOf,
    DatePipe,
    TagModule
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
  tipoAttivitaCorrente: string = '';
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
    const huntersRef = ref(database, 'attivita/attivita-stampa');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const customerId = this.sharedService.getCustomerId(); // Recupera l'ID del cliente

        // Crea una lista temporanea per le attività filtrate
        let tempAttivitaList = [];

        if (this.role === 'dipendente') {
          tempAttivitaList = Object.keys(data)
            .filter(key =>
              data[key].dipendenti?.risorse.some((r: any) => r.dipendenti === this.idUtente)
            )
            .map(key => ({ ...data[key], id: key }));
        } else {
          tempAttivitaList = Object.keys(data)
            .map(key => ({ ...data[key], id: key }));
        }

        // Filtra la lista in base all'ID del cliente sotto la voce commessa, se disponibile
        if (customerId) {
          this.attivitaList = tempAttivitaList.filter((attivita: any) => attivita.commessa === customerId);
        } else {
          this.attivitaList = tempAttivitaList;
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

    this.router.navigate(['/modifica-stampa', customer.id]);
  }
  ddt(customer: any) {
    this.router.navigate(['/ddt', customer.id]);
  }
  editCustomerDipendente(customer: any) {

    this.router.navigate(['/modifica-stampa-dipendente', customer.id]);
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
    this.router.navigate(['/nuova-generica/',  commessaId]);
    console.log(commessaId, 'commessaID')
  }
  openPDF(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }


  editCustomerGenerica(customer: any) {

    this.router.navigate(['/modifica-generica', customer.id]);
    console.log(customer.id);

  }

  visualizzaGenerica(customer:any): void {
    this.router.navigate(['/visualizza-generica', customer.id]);
  }
}

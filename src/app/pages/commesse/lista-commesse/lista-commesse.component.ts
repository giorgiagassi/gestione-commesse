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
import {AuthService} from "../../../providers/auth.service";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {SharedService} from "../../../providers/shared.service";
import {TooltipModule} from "primeng/tooltip";
import {DropdownModule} from "primeng/dropdown";
import {FormsModule} from "@angular/forms";
import {SelectButtonModule} from "primeng/selectbutton";
@Component({
  selector: 'app-lista-commesse',
  standalone: true,
    imports: [
        TableModule,
        ButtonModule,
        InputTextModule,
        RouterLink,
        NgIf,
        DatePipe,
        TooltipModule,
        DropdownModule,
        FormsModule,
        SelectButtonModule,
        CurrencyPipe
    ],
  templateUrl: './lista-commesse.component.html',
  styleUrl: './lista-commesse.component.css'
})
export class ListaCommesseComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  commesseList:any;
  filteredCommesseList: any;
  loading: boolean = false;
  role!: string;
  idUtente!:string;
  selectedComune: any;
  selectedTipo: any;
  selectedPnrr: any;
  pnrrOptions: any[] = [
    { label: 'Sì', value: 'si' },
    { label: 'No', value: 'no' }
  ];
  constructor(private router: Router,
              private authService: AuthService,
              private sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    this.getCommesseList();
    this.userDetails();
    this.getTipoComessaList();
    this.getComuniList();
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
    const huntersRef = ref(database, 'lista-commesse');
    this.loading = true;
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();

        let tempCommesseList = [];
        if (this.role === 'dipendente') {
          tempCommesseList = Object.keys(data)
            .filter(key => data[key].dipendenti?.risorse.some((r: any) => r.dipendenti === this.idUtente))
            .map(key => ({ ...data[key], id: key }));
        } else {
          tempCommesseList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        }

        tempCommesseList.sort((a, b) => b.id.localeCompare(a.id));

        this.commesseList = tempCommesseList;
        this.filteredCommesseList = [...this.commesseList]; // Inizializza la lista filtrata con tutti i dati
      } else {
        this.commesseList = [];
        this.filteredCommesseList = [];
      }
    } catch (error) {
      console.error('Errore durante il recupero delle commesse:', error);
    } finally {
      this.loading = false;
    }
  }


  editCustomer(customer: any) {

    this.router.navigate(['/modifica-commessa', customer.id]);
  }
  deleteCustomer(customer: any) {

    const customerRef = ref(database, `lista-commesse/${customer.id}`);

    remove(customerRef).then(() => {
      this.commesseList = this.commesseList.filter((item: any) => item.id !== customer.id);

    }).catch((error:any) => {
    });
  }

  attivitaCustomer(customer: any) {
    this.sharedService.setCustomerId(customer.id);
    this.router.navigate(['/lista-attivita', customer.id]);
    console.log(customer.id, 'listacommesse ')
  }

  contabilitaCustomer(customer: any) {
    this.sharedService.setCustomerId(customer.id);
    this.router.navigate(['/lista-contabilita', customer.id]);
  }
  fornitureCustomer(customer: any) {
    this.sharedService.setCustomerId(customer.id);
    this.router.navigate(['/lista-forniture', customer.id]);
    console.log(customer.id, 'listacommesse ')
  }
  comuneList: any;
  async getComuniList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/comuni');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.comuneList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.comuneList
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  tipoCommessaList:any;
  async getTipoComessaList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/tipo-commessa');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tipoCommessaList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.tipoCommessaList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }

  applyFilters() {
    this.filteredCommesseList = this.commesseList.filter((commessa:any) => {
      const matchesComune = this.selectedComune ? commessa.commessa.nome_comune === this.selectedComune : true;
      const matchesTipo = this.selectedTipo ? commessa.commessa.tipo_commessa === this.selectedTipo : true;
      const matchesPnrr = this.selectedPnrr ? commessa.commessa.pnrrValue === this.selectedPnrr : true;
      return matchesComune && matchesTipo && matchesPnrr;
    });
  }

  resetFilters() {
    this.selectedComune = null;
    this.selectedTipo = null;
    this.selectedPnrr = null;
    this.filteredCommesseList = [...this.commesseList]; // Resetta la lista filtrata con tutti i dati
  }

}

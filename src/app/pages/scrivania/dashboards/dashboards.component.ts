import {Component, OnInit, ViewChild} from '@angular/core';
import {get, getDatabase, ref, remove, update} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {Button} from "primeng/button";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {PrimeTemplate} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToggleButtonModule} from "primeng/togglebutton";
import {TooltipModule} from "primeng/tooltip";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {TabViewModule} from "primeng/tabview";
import {ComuniComponent} from "../../impostazioni/comuni/comuni.component";
import {DropdownModule} from "primeng/dropdown";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [
    Button,
    DatePipe,
    DialogModule,
    NgIf,
    PrimeTemplate,
    TableModule,
    ToggleButtonModule,
    TooltipModule,
    FormsModule,
    CurrencyPipe,
    TabViewModule,
    ComuniComponent,
    DropdownModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule
  ],
  templateUrl: './dashboards.component.html',
  styleUrl: './dashboards.component.css'
})
export class DashboardsComponent implements OnInit {
  @ViewChild('dt1') dt1: any;
  fattureList:any;
  fattureListOriginal: any;
  scadenzaListOriginal: any;
  scadenzaList:any;
  loading: boolean = false;
  visible: boolean = false;
  commessaData: any = {};
  descrizione!: string;
  filtroAnno: string = '';
  filtroEmissione: boolean | null = null;
  filtroPagamento: boolean | null = null;
  filtroAnnoScadenza: string = '';
  filtroEmissioneScadenza: boolean | null = null;
  filtroPagamentoScadenza: boolean | null = null;
  annicompetenza:any
  anni = [
    { label: '2022', value: '2022' },
    { label: '2023', value: '2023' },
    { label: '2024', value: '2024' },
  ];

  opzioniBoolean = [
    { label: 'SI', value: true },
    { label: 'NO', value: false },
  ];

  constructor(private router: Router,) {
  }
  ngOnInit(): void {
    this.getFattureList().then(() => {
      this.fattureInScadenzaList(); // Filtra la lista dopo averla caricata
    });

  }
  async getFattureList() {
    const huntersRef = ref(database, 'contabilita');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.fattureList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        this.fattureListOriginal = [...this.fattureList]; // Salva la copia originale
      }
    } catch (error) {
      console.error('Errore durante il caricamento:', error);
    }
  }

  showDialog(commessaId:string) {
    this.visible = true;
    this.getCommessaDetails(commessaId)
  }
  togglePagamento(customer: any, event: any): void {
    const pagato = event.checked;
    const customerRef = ref(database, `contabilita/${customer.id}/contabilita`);
    update(customerRef, {pagato}).catch((error: any) => {
      console.error('Errore :', error);
    });
  }
  toggleEmissione(customer: any, event: any): void {
    const fattura_emessa = event.checked;
    const customerRef = ref(database, `contabilita/${customer.id}/contabilita`);
    update(customerRef, {fattura_emessa}).catch((error: any) => {
      console.error('Errore :', error);
    });
  }
  editCustomer(customer: any) {
    this.router.navigate(['/modifica-contabilita', customer.id]);
  }
  deleteCustomer(customer: any) {
    const customerRef = ref(database, `contabilita/${customer.id}`);
    remove(customerRef).then(() => {
      this.fattureList = this.fattureList.filter((item: any) => item.id !== customer.id);
    }).catch((error: any) => {
      console.error('Errore', error);
    });
  }
  getCommessaDetails(commessaId:string): void {
    const commessaRef = ref(database, `lista-commesse/${commessaId}`);
    get(commessaRef).then((snapshot) => {
      if (snapshot.exists()) {
        const commessaData = snapshot.val();
        this.commessaData = commessaData.commessa;
        this.annicompetenza = this.getAnniCompetenza(commessaData.commessa);
      } else {
        Swal.fire('Errore', 'Impossibile trovare la commessa', 'error');
      }
    }).catch(() => {
      Swal.fire('Errore', 'Impossibile caricare i dati della commessa', 'error');
    });
  }
  getAnniCompetenza(data: any): number[] {
    const anni: number[] = [];

    // Scansiona tutte le chiavi dell'oggetto
    Object.keys(data).forEach(key => {
      if (key.startsWith('year_') && data[key] === true) {
        // Estrai l'anno dalla chiave e aggiungilo all'array
        const year = parseInt(key.replace('year_', ''), 10);
        if (!isNaN(year)) {
          anni.push(year);
        }
      }
    });

    // Ordina gli anni in ordine crescente
    return anni.sort((a, b) => a - b);
  }
  fattureInScadenzaList(): void {
    const today = new Date(); // Data odierna
    const currentMonth = today.getMonth(); // Mese attuale
    const currentYear = today.getFullYear(); // Anno attuale

    this.scadenzaList = this.fattureList.filter((fattura: any) => {
      if (!fattura.contabilita || !fattura.contabilita.data_fine) {
        console.warn('Fattura senza data_fine o contabilita:', fattura);
        return false;
      }
      const dataFine = new Date(fattura.contabilita.data_fine); // Converti data_fine
      const isCurrentMonth = dataFine.getMonth() === currentMonth && dataFine.getFullYear() === currentYear;
      const isNotPaid = fattura.contabilita.pagato === false;
      return isCurrentMonth && isNotPaid;
    });
    this.scadenzaListOriginal = [...this.scadenzaList];
  }
  resetFiltri(): void {
    this.fattureList = [...this.fattureListOriginal]; // Ripristina la lista originale
    this.filtroAnno = '';
    this.filtroEmissione = null;
    this.filtroPagamento = null;
  }

  aggiornaListaFiltrata(): void {
    this.fattureList = this.fattureListOriginal.filter((fattura: any) => {
      const annoFine = new Date(fattura.contabilita.data_fine).getFullYear().toString();
      const filtroAnnoValido = this.filtroAnno ? annoFine === this.filtroAnno : true;
      const filtroEmissioneValido = this.filtroEmissione !== null ? fattura.contabilita.fattura_emessa === this.filtroEmissione : true;
      const filtroPagamentoValido = this.filtroPagamento !== null ? fattura.contabilita.pagato === this.filtroPagamento : true;

      return filtroAnnoValido && filtroEmissioneValido && filtroPagamentoValido;
    });
  }
  applicaFiltroAnno(): void {
    this.aggiornaListaFiltrata();
  }

  applicaFiltroEmissione(): void {
    this.aggiornaListaFiltrata();
  }

  applicaFiltroPagamento(): void {
    this.aggiornaListaFiltrata();
  }
  aggiornaScadenzaFiltrata(): void {
    this.scadenzaList = this.scadenzaListOriginal.filter((fattura: any) => {
      const annoFine = new Date(fattura.contabilita.data_fine).getFullYear().toString();
      const filtroAnnoValido = this.filtroAnnoScadenza ? annoFine === this.filtroAnnoScadenza : true;
      const filtroEmissioneValido = this.filtroEmissioneScadenza !== null ? fattura.contabilita.fattura_emessa === this.filtroEmissioneScadenza : true;
      const filtroPagamentoValido = this.filtroPagamentoScadenza !== null ? fattura.contabilita.pagato === this.filtroPagamentoScadenza : true;

      return filtroAnnoValido && filtroEmissioneValido && filtroPagamentoValido;
    });
  }
  applicaFiltroAnnoScadenza(): void {
    this.aggiornaScadenzaFiltrata();
  }

  applicaFiltroEmissioneScadenza(): void {
    this.aggiornaScadenzaFiltrata();
  }

  applicaFiltroPagamentoScadenza(): void {
    this.aggiornaScadenzaFiltrata();
  }
  resetScadenzaFiltri(): void {
    this.scadenzaList = [...this.scadenzaListOriginal]; // Ripristina la lista originale
    this.filtroAnnoScadenza = '';
    this.filtroEmissioneScadenza = null;
    this.filtroPagamentoScadenza = null;
  }

}

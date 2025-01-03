import {Component, OnInit, ViewChild} from '@angular/core';
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {get, getDatabase, push, ref, remove, update} from "firebase/database";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../providers/auth.service";
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, DatePipe, NgIf} from "@angular/common";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {TagModule} from "primeng/tag";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {DialogModule} from "primeng/dialog";
import {TooltipModule} from "primeng/tooltip";

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
    FormsModule,
    DialogModule,
    TooltipModule,
    CurrencyPipe
  ],
  templateUrl: './lista-contabilita.component.html',
  styleUrl: './lista-contabilita.component.css'
})
export class ListaContabilitaComponent implements OnInit {
  @ViewChild('dt1') dt1: any;
  attivitaList: any;
  checked: boolean = false;
  loading: boolean = false;
  role!: string;
  idUtente!: string;
annicompetenza:any
  commessaId!: string;
  commessaData: any = {};
  competenzaFiscale: string = '';
  tempiFatturazione: string = '';
  dataInizio!: Date;
  dataFine!: Date;
  anniSelezionati: number[] = [];
  importoComessa!: number;
  cig!: string;
  descrizione!: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.commessaId = this.route.snapshot.paramMap.get('id') || '';
    if (this.commessaId) {
      this.getCommesseList();
      this.getCommessaDetails();
    }

    this.userDetails();
  }

  userDetails(): void {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.role = userDetails.role;
      this.idUtente = userDetails.id;
    }
  }

  async getCommesseList() {
    const huntersRef = ref(database, 'contabilita');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const customerId = this.commessaId;

        let tempAttivitaList = Object.keys(data).map(key => ({...data[key], id: key}));

        this.attivitaList = customerId ? tempAttivitaList.filter((attivita: any) => attivita.commessa === customerId) : tempAttivitaList;
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
    const customerRef = ref(database, `contabilita/${customer.id}`);
    remove(customerRef).then(() => {
      this.attivitaList = this.attivitaList.filter((item: any) => item.id !== customer.id);
    }).catch((error: any) => {
      console.error('Errore', error);
    });
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

  getCommessaDetails(): void {
    const commessaRef = ref(database, `lista-commesse/${this.commessaId}`);
    get(commessaRef).then((snapshot) => {
      if (snapshot.exists()) {
        const commessaData = snapshot.val();
        this.commessaData = commessaData.commessa;
        this.tempiFatturazione = commessaData.commessa.tempi_fatturazione;
        this.competenzaFiscale = commessaData.commessa.competenza_fiscale;
        this.importoComessa = commessaData.commessa.importo;
        this.dataInizio = new Date(commessaData.commessa.data_inizio);
        this.dataFine = new Date(commessaData.commessa.data_fine);
        this.anniSelezionati = commessaData.commessa.anni || [];
        this.descrizione = commessaData.commessa.descrizione_fattura;
        this.cig = commessaData.commessa.cig;
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
  calculateInvoiceAmount(): number {
    let totalAmount = this.importoComessa;
    let invoiceAmount = 0;

    if (totalAmount <= 0 || isNaN(totalAmount)) {
      Swal.fire('Errore', 'Importo della commessa non valido.', 'error');
      return NaN;
    }

    const periods = this.tempiFatturazione === 'Mensile' ? this.getMonthsDifference(this.dataInizio, this.dataFine) :
      this.tempiFatturazione === 'Bimestrale' ? this.getBimestersDifference(this.dataInizio, this.dataFine) :
        this.tempiFatturazione === 'Trimestrale' ? this.getTrimestersDifference(this.dataInizio, this.dataFine) :
          this.tempiFatturazione === 'Semestrale' ? this.getSemestersDifference(this.dataInizio, this.dataFine) :
            this.tempiFatturazione === 'Annuale' ? this.getYearsDifference(this.dataInizio, this.dataFine) : 0;

    if (periods <= 0) {
      Swal.fire('Errore', 'Intervallo di date non valido per il calcolo.', 'error');
      return NaN;
    }

    invoiceAmount = totalAmount / periods;
    return parseFloat(invoiceAmount.toFixed(2));
  }

//mesile bimestrale
  generateInvoices(): void {
    const invoiceAmount = this.calculateInvoiceAmount();
    if (invoiceAmount <= 0 || isNaN(invoiceAmount)) {
      Swal.fire('Errore', 'Importo non valido per la generazione delle fatture.', 'error');
      return;
    }

    // Consideriamo solo Mensile e Bimestrale
    let increment = 1; // default mensile
    if (this.tempiFatturazione === 'Bimestrale') {
      increment = 2;
    } else if (this.tempiFatturazione !== 'Mensile') {
      Swal.fire('Errore', 'Seleziona "Mensile" o "Bimestrale" come intervallo.', 'error');
      return;
    }

    let startDate = new Date(this.dataInizio);
    const endDate = new Date(this.dataFine);
    const invoices: any[] = [];
    let count = 1;

    // Cicla finché la data di inizio periodo è <= data di fine
    while (startDate <= endDate) {
      const periodoInizio = new Date(startDate);
      const periodoFine = new Date(periodoInizio);
      // Aggiunge 1 o 2 mesi, poi imposta il giorno a 0 per avere l'ultimo giorno del mese
      periodoFine.setMonth(periodoFine.getMonth() + increment);
      periodoFine.setDate(0);

      // Se la fine supera la dataFine del contratto, la tronchiamo
      if (periodoFine > endDate) {
        periodoFine.setTime(endDate.getTime());
      }

      invoices.push({
        n_fattura: `F${count++}`,
        importo: invoiceAmount,
        descrizione: this.descrizione,
        cig: this.cig,
        data_inizio: this.formatDate(periodoInizio),
        data_fine: this.formatDate(periodoFine),
        pagato: false,
        emissione_fattura: false
      });

      // Avanza la startDate al mese successivo o di due mesi, impostando il giorno al primo
      startDate = new Date(periodoFine.getFullYear(), periodoFine.getMonth(), periodoFine.getDate());
      startDate.setDate(startDate.getDate() + 1);
    }

    Swal.fire({
      title: 'Genera Fatture',
      text: `Generare ${invoices.length} fatture con le date di riferimento?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Genera',
      cancelButtonText: 'Annulla',
    }).then((result) => {
      if (result.isConfirmed) {
        invoices.forEach((fatturaData: any) => {
          const dbRef = ref(database, `contabilita`);
          push(dbRef, {commessa: this.commessaId, contabilita: fatturaData});
        });
        Swal.fire('Successo', `${invoices.length} fatture generate con successo`, 'success').then(() => {
          this.router.navigate(['/lista-commesse']);
        });
      }
    });
  }

  generateInvoicesByPeriod(period: 'Trimestrale' | 'Semestrale'): void {
    const invoiceAmount = this.calculateInvoiceAmount();
    if (invoiceAmount <= 0 || isNaN(invoiceAmount)) {
      Swal.fire('Errore', 'Importo non valido per la generazione delle fatture.', 'error');
      return;
    }

    const startDate = new Date(this.dataInizio);
    const endDate = new Date(this.dataFine);
    const invoices: any[] = [];

    console.log(`Periodo di fatturazione: ${period}`);
    console.log(`Data inizio: ${this.formatDate(startDate)}, Data fine: ${this.formatDate(endDate)}`);

    const incrementMonths = period === 'Trimestrale' ? 3 : 6;
    let currentStartDate = new Date(startDate.getTime());
    let invoiceCount = 1;

    while (currentStartDate <= endDate) {
      const periodoInizio = new Date(currentStartDate.getTime());

      let periodoFine = new Date(periodoInizio.getFullYear(), periodoInizio.getMonth() + incrementMonths, 0);
      if (periodoFine > endDate) {
        periodoFine = new Date(endDate.getTime());
      }

      console.log(`Generazione fattura ${invoiceCount}: Inizio ${this.formatDate(periodoInizio)}, Fine ${this.formatDate(periodoFine)}`);

      invoices.push({
        n_fattura: `F${invoiceCount++}`,
        importo: invoiceAmount,
        descrizione: this.descrizione,
        cig: this.cig,
        data_inizio: this.formatDate(periodoInizio),
        data_fine: this.formatDate(periodoFine),
        pagato: false,
        emissione_fattura: false
      });

      currentStartDate = new Date(periodoFine.getTime());
      currentStartDate.setDate(currentStartDate.getDate() + 1);
    }

    console.log(`Numero totale di fatture generate: ${invoices.length}`);

    Swal.fire({
      title: `Genera Fatture (${period})`,
      text: `Generare ${invoices.length} fatture con le date di riferimento?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Genera',
      cancelButtonText: 'Annulla',
    }).then((result) => {
      if (result.isConfirmed) {
        invoices.forEach((fatturaData: any) => {
          const dbRef = ref(database, `contabilita`);
          push(dbRef, {commessa: this.commessaId, contabilita: fatturaData});
        });
        Swal.fire('Successo', `${invoices.length} fatture generate con successo`, 'success').then(() => {
          this.router.navigate(['/lista-commesse']);
        });
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  getMonthsDifference(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  }

  getBimestersDifference(startDate: Date, endDate: Date): number {
    const months = this.getMonthsDifference(startDate, endDate);
    return Math.ceil(months / 2);
  }

  getTrimestersDifference(startDate: Date, endDate: Date): number {
    const months = this.getMonthsDifference(startDate, endDate);
    return Math.ceil(months / 3);
  }

  getSemestersDifference(startDate: Date, endDate: Date): number {
    const months = this.getMonthsDifference(startDate, endDate);
    return Math.ceil(months / 6);
  }

  getYearsDifference(startDate: Date, endDate: Date): number {
    return endDate.getFullYear() - startDate.getFullYear();
  }

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  //annuale
  generateInvoicesAnnuale(): void {
    const totalAmount = this.importoComessa; // 15.000 €
    const startDate = new Date(this.dataInizio); // 1 maggio 2023
    const endDate = new Date(this.dataFine); // 31 dicembre 2027
    const invoices: any[] = [];
    let invoiceCount = 1;

    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    const totalMonths = this.getMonthsDifference(startDate, endDate); // Mesi totali del periodo
    const monthlyAmount = totalAmount / totalMonths; // Importo mensile

    for (let year = startYear; year <= endYear; year++) {
      let yearStartDate = new Date(year, 0, 1); // 1 gennaio dell'anno corrente
      let yearEndDate = new Date(year, 11, 31); // 31 dicembre dell'anno corrente

      // Se è il primo anno, usa la data di inizio reale
      if (year === startYear) {
        yearStartDate = startDate;
      }

      // Se è l'ultimo anno, usa la data di fine reale
      if (year === endYear) {
        yearEndDate = endDate;
      }

      const monthsInYear = this.getMonthsDifference(yearStartDate, yearEndDate); // Mesi effettivi in questo anno
      const yearAmount = monthsInYear * monthlyAmount; // Importo per l'anno corrente

      invoices.push({
        n_fattura: `F${invoiceCount++}`,
        importo: parseFloat(yearAmount.toFixed(2)),
        descrizione: this.descrizione,
        cig: this.cig,
        data_inizio: this.formatDate(yearStartDate),
        data_fine: this.formatDate(yearEndDate),
        pagato: false,
        emissione_fattura: false
      });
    }

    // Verifica somma totale
    const totalGenerated = invoices.reduce((sum, invoice) => sum + invoice.importo, 0);
    console.log(`Importo totale generato: ${totalGenerated} (atteso: ${totalAmount})`);

    Swal.fire({
      title: 'Genera Fatture (Annuale)',
      text: `Generare ${invoices.length} fatture con le date di riferimento?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Genera',
      cancelButtonText: 'Annulla',
    }).then((result) => {
      if (result.isConfirmed) {
        invoices.forEach((fatturaData: any) => {
          const dbRef = ref(database, `contabilita`);
          push(dbRef, { commessa: this.commessaId, contabilita: fatturaData });
        });
        Swal.fire('Successo', `${invoices.length} fatture generate con successo`, 'success').then(() => {
          this.router.navigate(['/lista-commesse']);
        });
      }
    });
  }


}

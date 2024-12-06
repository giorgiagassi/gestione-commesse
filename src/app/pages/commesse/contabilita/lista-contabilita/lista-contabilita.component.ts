import {Component, OnInit, ViewChild} from '@angular/core';
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {get, getDatabase, push, ref, remove, update} from "firebase/database";
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
import Swal from "sweetalert2";
import {DialogModule} from "primeng/dialog";
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
    DialogModule
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

  commessaId!: string;  // ID della commessa corrente
  commessaData: any = {}; // Dati della commessa
  competenzaFiscale: string = '';
  tempiFatturazione: string = '';
  dataInizio!: Date;
  dataFine!: Date;
  anniSelezionati: number[] = [];
  importoComessa!: number;
cig!:string;
descrizione!: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharedService: SharedService
) {
  }

  ngOnInit() {
    this.commessaId = this.route.snapshot.paramMap.get('id') || '';
    console.log(this.commessaId, 'commessaid');
    if (this.commessaId) {
      this.getCommesseList();
      this.getCommessaDetails();
    } else {
      console.log("ID commessa non trovato.");
    }

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
        const customerId = this.commessaId; // Recupera l'ID del cliente

        // Crea una lista temporanea per le attività filtrate
        let tempAttivitaList = [];


          tempAttivitaList = Object.keys(data)
            .map(key => ({ ...data[key], id: key }));

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
  // Carica i dati della commessa specifica
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
        console.log(commessaData.commessa.importo), 'commessa';
      } else {
        Swal.fire('Errore', 'Impossibile trovare la commessa', 'error');
      }
    }).catch((error) => {
      console.error("Errore nel caricamento della commessa", error);
      Swal.fire('Errore', 'Impossibile caricare i dati della commessa', 'error');
    });
  }
  // Funzione per calcolare l'importo per fattura
  calculateInvoiceAmount(): number {
    let totalAmount = this.importoComessa; // L'importo totale della commessa
    let invoiceAmount = 0;

    // Verifica se l'importo della commessa è valido
    if (totalAmount <= 0 || isNaN(totalAmount)) {
      Swal.fire('Errore', 'Importo della commessa non valido.', 'error');
      return NaN; // Restituisce NaN se l'importo non è valido
    }

    // Se competenza fiscale è "si"
    if (this.competenzaFiscale === 'si') {
      if (this.tempiFatturazione === 'Mensile') {
        // Calcola il numero di mesi tra data_inizio e data_fine
        const months = this.getMonthsDifference(this.dataInizio, this.dataFine);
        if (months <= 0) {
          Swal.fire('Errore', 'L\'intervallo di date non è valido per il calcolo mensile.', 'error');
          return NaN;
        }
        invoiceAmount = totalAmount / months; // Spalmare l'importo tra i mesi
      } else if (this.tempiFatturazione === 'Trimestrale') {
        const trimesters = this.getTrimestersDifference(this.dataInizio, this.dataFine);
        if (trimesters <= 0) {
          Swal.fire('Errore', 'L\'intervallo di date non è valido per il calcolo trimestrale.', 'error');
          return NaN;
        }
        invoiceAmount = totalAmount / trimesters; // Spalmare l'importo tra i trimestri
      } else if (this.tempiFatturazione === 'Semestrale') {
        const semesters = this.getSemestersDifference(this.dataInizio, this.dataFine);
        if (semesters <= 0) {
          Swal.fire('Errore', 'L\'intervallo di date non è valido per il calcolo semestrale.', 'error');
          return NaN;
        }
        invoiceAmount = totalAmount / semesters; // Spalmare l'importo tra i semestri
      } else if (this.tempiFatturazione === 'Annuale') {
        const years = this.getYearsDifference(this.dataInizio, this.dataFine);
        if (years <= 0) {
          Swal.fire('Errore', 'L\'intervallo di date non è valido per il calcolo annuale.', 'error');
          return NaN;
        }
        invoiceAmount = totalAmount / years; // Spalmare l'importo tra gli anni
      }
    }

    // Se competenza fiscale è "no"
    else if (this.competenzaFiscale === 'no') {
      let periods = 0;
      if (this.tempiFatturazione === 'Mensile') {
        // Se 'tempi_fatturazione' è mensile, calcoliamo i mesi totali per gli anni selezionati
        periods = this.anniSelezionati.length * 12; // Ogni anno ha 12 mesi
        if (periods <= 0) {
          Swal.fire('Errore', 'Nessun anno selezionato per la distribuzione dell\'importo.', 'error');
          return NaN;
        }
        invoiceAmount = totalAmount / periods; // Dividi per il numero di mesi totali
      } else if (this.tempiFatturazione === 'Trimestrale') {
        // Calcoliamo il numero di trimestri totali
        periods = this.anniSelezionati.length * 4; // Ogni anno ha 4 trimestri
        if (periods <= 0) {
          Swal.fire('Errore', 'Nessun anno selezionato per la distribuzione dell\'importo.', 'error');
          return NaN;
        }
        invoiceAmount = totalAmount / periods; // Dividi per il numero di trimestri
      } else if (this.tempiFatturazione === 'Semestrale') {
        // Calcoliamo il numero di semestri totali
        periods = this.anniSelezionati.length * 2; // Ogni anno ha 2 semestri
        if (periods <= 0) {
          Swal.fire('Errore', 'Nessun anno selezionato per la distribuzione dell\'importo.', 'error');
          return NaN;
        }
        invoiceAmount = totalAmount / periods; // Dividi per il numero di semestri
      } else if (this.tempiFatturazione === 'Annuale') {
        // Dividi per il numero di anni selezionati
        periods = this.anniSelezionati.length;
        if (periods <= 0) {
          Swal.fire('Errore', 'Nessun anno selezionato per la distribuzione dell\'importo.', 'error');
          return NaN;
        }
        invoiceAmount = totalAmount / periods; // Dividi per il numero di anni selezionati
      }
    }

    invoiceAmount = parseFloat(invoiceAmount.toFixed(2));

    return invoiceAmount;
  }


  getMonthsDifference(startDate: Date, endDate: Date): number {
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth();
    return (endYear - startYear) * 12 + (endMonth - startMonth);
  }

  getTrimestersDifference(startDate: Date, endDate: Date): number {
    const months = this.getMonthsDifference(startDate, endDate);
    return Math.floor(months / 3); // Calcola il numero di trimestri
  }

  getSemestersDifference(startDate: Date, endDate: Date): number {
    const months = this.getMonthsDifference(startDate, endDate);
    return Math.floor(months / 6); // Calcola il numero di semestri
  }

  getYearsDifference(startDate: Date, endDate: Date): number {
    return endDate.getFullYear() - startDate.getFullYear();
  }


  // Funzione per generare le fatture
  generateInvoices(): void {
    const invoiceAmount = this.calculateInvoiceAmount(); // Calcola l'importo per ogni fattura

    // Verifica se l'importo per fattura è valido
    if (invoiceAmount <= 0 || isNaN(invoiceAmount)) {
      Swal.fire('Errore', 'Importo non valido per la generazione delle fatture.', 'error');
      return;
    }

    let numberOfInvoices = 0;

    // Se competenza fiscale è "si" e tempi_fatturazione è mensile
    if (this.competenzaFiscale === 'si' && this.tempiFatturazione === 'Mensile') {
      // Calcola il numero di mesi tra data_inizio e data_fine
      numberOfInvoices = this.getMonthsDifference(this.dataInizio, this.dataFine); // Dovrebbe essere 12 se l'intervallo è 1 anno
    }

    // Se competenza fiscale è "si" e tempi_fatturazione è trimestrale
    else if (this.competenzaFiscale === 'si' && this.tempiFatturazione === 'Trimestrale') {
      // Calcola il numero di trimestri tra data_inizio e data_fine
      numberOfInvoices = this.getTrimestersDifference(this.dataInizio, this.dataFine);
    }

    // Se competenza fiscale è "si" e tempi_fatturazione è semestrale
    else if (this.competenzaFiscale === 'si' && this.tempiFatturazione === 'Semestrale') {
      // Calcola il numero di semestri tra data_inizio e data_fine
      numberOfInvoices = this.getSemestersDifference(this.dataInizio, this.dataFine);
    }

    // Se competenza fiscale è "si" e tempi_fatturazione è annuale
    else if (this.competenzaFiscale === 'si' && this.tempiFatturazione === 'Annuale') {
      // Calcola il numero di anni tra data_inizio e data_fine
      numberOfInvoices = this.getYearsDifference(this.dataInizio, this.dataFine);
    }

    // Se competenza fiscale è "no" e tempi_fatturazione è mensile
    else if (this.competenzaFiscale === 'no' && this.tempiFatturazione === 'Mensile') {
      numberOfInvoices = this.anniSelezionati.length * 12; // Ogni anno ha 12 mesi
    }

    // Se competenza fiscale è "no" e tempi_fatturazione è trimestrale
    else if (this.competenzaFiscale === 'no' && this.tempiFatturazione === 'Trimestrale') {
      numberOfInvoices = this.anniSelezionati.length * 4; // Ogni anno ha 4 trimestri
    }

    // Se competenza fiscale è "no" e tempi_fatturazione è semestrale
    else if (this.competenzaFiscale === 'no' && this.tempiFatturazione === 'Semestrale') {
      numberOfInvoices = this.anniSelezionati.length * 2; // Ogni anno ha 2 semestri
    }

    // Se competenza fiscale è "no" e tempi_fatturazione è annuale
    else if (this.competenzaFiscale === 'no' && this.tempiFatturazione === 'Annuale') {
      numberOfInvoices = this.anniSelezionati.length; // Ogni anno avrà una fattura
    }

    // Verifica che il numero di fatture sia valido
    if (numberOfInvoices <= 0) {
      Swal.fire('Errore', 'Numero di fatture non valido.', 'error');
      return;
    }
      // Mostra la conferma di generazione delle fatture
      Swal.fire({
        title: 'Genera Fatture',
        text: `Generare ${numberOfInvoices} fatture?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Genera',
        cancelButtonText: 'Annulla',
      }).then((result) => {
        if (result.isConfirmed) {
          for (let i = 0; i < numberOfInvoices; i++) {
            const fatturaData = {
              n_fattura: `F${i + 1}`,
              importo: invoiceAmount,
              descrizione: this.descrizione, // Puoi personalizzare la descrizione
              cig: this.cig, // Puoi personalizzare la descrizione
              data_inizio: this.dataInizio,
              data_fine: this.dataFine,
              pagato: false,  // O altro valore di stato
            };
            const dataSend = {
              commessa: this.commessaId,
              contabilita: fatturaData
            };
            const dbRef = ref(database, `contabilita`);
            push(dbRef, dataSend).then(() => {
              console.log(`Fattura ${i + 1} generata con successo`);
            }).catch((error:any) => {
              console.error('Errore durante la generazione della fattura:', error);
            });
          }

          Swal.fire('Successo', `${numberOfInvoices} fatture generate con successo`, 'success')
            .then(() => {
              this.router.navigate(['/lista-commesse']);  // Redirige alla lista delle commesse
            });
        }
      });
  }
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

}


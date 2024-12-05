import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {get, getDatabase, push, ref} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {TooltipModule} from "primeng/tooltip";
import {RadioButtonModule} from "primeng/radiobutton";
import { getStorage,  ref as storageRef, uploadBytesResumable, getDownloadURL, UploadTask } from "firebase/storage";


declare var $: any;
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

@Component({
  selector: 'app-nuova-commessa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    NgForOf,
    TooltipModule,
    RadioButtonModule,
    NgClass
  ],
  templateUrl: './nuova-commessa.component.html',
  providers: [
    {provide: 'tooltip', useValue: {showDelay: 0, hideDelay: 0}}
  ],
  styleUrl: './nuova-commessa.component.css'
})
export class NuovaCommessaComponent implements OnInit, AfterViewInit {
  pnrrValue: string = '';
  dipendentiList: any;
  filteredDipendentiList: any;
  filteredPMList: any;
  commessaForm!: FormGroup;
  risorseForm!: FormGroup;
  responsabileForm!: FormGroup;
  misuraList: any;
  tempoList: any;
  tipoCommessaList: any;
  comuneList: any;
  loading: boolean = false;
  competenzaFiscaleNo: boolean = false;
  dateRangeValid: boolean = false;
  years: number[] = [];
  selectedFile: File | null = null;
  fileUploadUrl: string = '';
  uploadedFile: any = null; // Oggetto per memorizzare il file caricato e il suo stato
  uploadTask: UploadTask | null = null; // Per gestire il task di upload
  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.getUserList();
    this.#load();
    this.getTipoComessaList();
    this.getMisuraList();
    this.getComuniList();
    this.onCompetenzaFiscaleChange();
    this.onDateChange();
    this.checkDateRange();
    this.getTempoList();
  }

  async #load() {
    this.commessaForm = this.formBuilder.group({
      nome_comune: new FormControl(''),
      tipo_appalto: new FormControl(''),
      importo: new FormControl(''),
      data_inizio: new FormControl(''),
      data_fine: new FormControl(''),
      competenza_fiscale: new FormControl('si'),
      codice_fatturazione: new FormControl(''),
      tempi_fatturazione: new FormControl(''),
      metodo_fatturazione: new FormControl(''),
      determina: new FormControl(''),
      pnrrValue: new FormControl('si'),
      tipo_commessa: new FormControl(''),
      misura: new FormControl(''),
      pm: new FormControl(''),
      cig: new FormControl(''),
      descrizione_fattura: new FormControl(''),
      determinaUrl: new FormControl(''),
      anni: this.formBuilder.array([])

    })

    this.risorseForm = this.formBuilder.group({
      risorse: this.formBuilder.array([this.createRisorsa()])
    });

    this.responsabileForm = this.formBuilder.group({
      nome_responsabile: new FormControl(''),
      cognome_responsabile: new FormControl(''),
      email_responsabile: new FormControl(''),
      cellulare_responsabile: new FormControl(''),

    })
  }

  async getUserList() {
    this.loading = true;
    const usersRef = ref(database, 'users');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.dipendentiList = Object.keys(data).map(key => ({...data[key], id: key}));

        // Filtra qui i dipendenti per ruolo
        this.filteredDipendentiList = this.dipendentiList.filter((dipendente: any) => dipendente.role === 'dipendente');
        this.filteredPMList = this.dipendentiList.filter((dipendente: any) => dipendente.role === 'pm');


        return this.filteredDipendentiList && this.filteredPMList;
      } else {

        return null;
      }
    } catch (error) {

      return null;
    } finally {
      this.loading = false; // Nascondi lo spinner
    }
  }

  createRisorsa(): FormGroup {
    return this.formBuilder.group({
      dipendenti: [''],
      tempo: [''],
      percentuale: [''] || null,
      mostraPercentuale: [false]
    });
  }

  get risorse(): FormArray {
    return this.risorseForm.get('risorse') as FormArray;
  }

  addRisorsa() {
    this.risorse.push(this.createRisorsa());
  }

  removeRisorsa(index: number) {
    if (this.risorse.length > 1) {
      this.risorse.removeAt(index);
    }
  }

  saveForm(): void {
    this.loading = true;  // Inizia a mostrare lo spinner

    const dataSend = {
      commessa: {
        nome_comune: this.commessaForm?.get('nome_comune')!?.value || null,
        tipo_appalto: this.commessaForm?.value.tipo_appalto,
        importo: this.commessaForm?.value.importo,
        data_inizio: this.commessaForm?.value.data_inizio,
        data_fine: this.commessaForm?.value.data_fine,
        competenza_fiscale: this.commessaForm?.value.competenza_fiscale,
        codice_fatturazione: this.commessaForm?.value.codice_fatturazione,
        tempi_fatturazione: this.commessaForm?.value.tempi_fatturazione,
        metodo_fatturazione: this.commessaForm?.value.metodo_fatturazione,
        determina: this.commessaForm?.value.determina,
        pnrrValue: this.commessaForm?.value.pnrrValue,
        tipo_commessa: this.commessaForm?.get('tipo_commessa')!.value || null,
        misura: this.commessaForm?.get('misura')!.value || null,
        pm: this.commessaForm?.value.pm,
        cig: this.commessaForm?.value.cig,
        descrizione_fattura: this.commessaForm?.value.descrizione_fattura,
        anni: this.commessaForm?.get('anni')!.value || null,
      },
      dipendenti: {
        risorse: this.risorseForm!?.get('risorse')!.value || null
      },
      responsabile: {
        nome_responsabile: this.responsabileForm.value.nome_responsabile,
        cognome_responsabile: this.responsabileForm.value.cognome_responsabile,
        email_responsabile: this.responsabileForm.value.email_responsabile,
        cellulare_responsabile: this.responsabileForm.value.cellulare_responsabile,
      }
    };

    const commessaRef = ref(database, 'lista-commesse');
    push(commessaRef, dataSend).then(() => {
      Swal.fire({title: 'Commessa creata con successo', icon: "success"});
      this.router.navigate(['/lista-commesse']);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    }).finally(() => {
      this.loading = false;  // Nascondi lo spinner
    });
  }

  updateTempo(index: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tempo = selectElement.value;
    const risorsa = this.risorse.at(index) as FormGroup;
    risorsa.patchValue({
      mostraPercentuale: tempo === 'part'
    });
  }


  async getComuniList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/comuni');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.comuneList = Object.keys(data).map(key => ({...data[key], id: key}));
        return this.comuneList
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      this.loading = false; // Nascondi lo spinner
    }
  }

  async getTipoComessaList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/tipo-commessa');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tipoCommessaList = Object.keys(data).map(key => ({...data[key], id: key}));
        return this.tipoCommessaList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    } finally {
      this.loading = false; // Nascondi lo spinner
    }
  }

  async getMisuraList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/misura-pnrr');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.misuraList = Object.keys(data).map(key => ({...data[key], id: key}));
        return this.misuraList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    } finally {
      this.loading = false; // Nascondi lo spinner
    }
  }

  ngAfterViewInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
  }

  // Ascolta i cambiamenti di 'competenza_fiscale'
  onCompetenzaFiscaleChange() {
    this.commessaForm.get('competenza_fiscale')?.valueChanges.subscribe(value => {
      this.competenzaFiscaleNo = value === 'no';
      if (this.competenzaFiscaleNo) {
        this.checkDateRange();
      } else {
        this.years = [];
        this.dateRangeValid = false;
      }
    });
  }

  // Ascolta i cambiamenti delle date 'data_inizio' e 'data_fine'
  onDateChange() {
    this.commessaForm.get('data_inizio')?.valueChanges.subscribe(() => {
      if (this.competenzaFiscaleNo) {
        this.checkDateRange();
      }
    });
    this.commessaForm.get('data_fine')?.valueChanges.subscribe(() => {
      if (this.competenzaFiscaleNo) {
        this.checkDateRange();
      }
    });
  }

  // Verifica che le date siano valide e genera gli anni
  checkDateRange() {
    const dataInizio = this.commessaForm.get('data_inizio')?.value;
    const dataFine = this.commessaForm.get('data_fine')?.value;

    if (dataInizio && dataFine) {
      const startDate = new Date(dataInizio);
      const endDate = new Date(dataFine);

      // Verifica se le date sono corrette (data_inizio < data_fine)
      if (startDate < endDate) {
        this.dateRangeValid = true;
        this.generateYears(startDate, endDate);
      } else {
        this.dateRangeValid = false;
        this.years = [];
      }
    }
  }

  // Calcola gli anni tra la data di inizio e fine
  generateYears(startDate: Date, endDate: Date) {
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    this.years = [];

    for (let year = startYear; year <= endYear; year++) {
      this.years.push(year);
    }
  }

  onYearChange(year: number, event: any): void {
    const yearsArray = this.commessaForm.get('anni') as FormArray;

    if (event.target.checked) {
      // Aggiungi l'anno selezionato nel FormArray
      yearsArray.push(new FormControl(year));
    } else {
      // Rimuovi l'anno dal FormArray se deselezionato
      const index = yearsArray.controls.findIndex(control => control.value === year);
      if (index !== -1) {
        yearsArray.removeAt(index);
      }
    }
  }

  async getTempoList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/tempi-fatturazione');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tempoList = Object.keys(data).map(key => ({...data[key], id: key}));
        return this.tempoList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    } finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  // Gestione della selezione del file
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadFileToFirebase();
    }
  }

  // Caricamento del file su Firebase Storage
  uploadFileToFirebase(): void {
    if (this.selectedFile) {
      // Imposta l'oggetto uploadedFile con lo stato iniziale
      this.uploadedFile = {
        name: this.selectedFile.name,
        size: (this.selectedFile.size / (1024 * 1024)).toFixed(2), // Dimensione in MB
        status: 'uploading', // stato iniziale del caricamento
        progress: 0,
        url: ''
      };

      const filePath = `determine/${new Date().getTime()}_${this.selectedFile.name}`;
      const fileRef = storageRef(storage, filePath);

      // Caricamento del file
      this.uploadTask = uploadBytesResumable(fileRef, this.selectedFile);

      // Monitoraggio dello stato del caricamento
      this.uploadTask.on('state_changed',
        (snapshot) => {
          // Calcola il progresso del caricamento
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadedFile.progress = progress;
          console.log('Upload progress: ', progress);
        },
        (error) => {
          // Gestione degli errori
          this.uploadedFile.status = 'error';
          console.error('Error during file upload: ', error);
          Swal.fire('Errore', 'Errore durante il caricamento del file.', 'error');
        },
        () => {
          // Una volta completato il caricamento, ottieni l'URL
          getDownloadURL(this.uploadTask!.snapshot.ref).then((url) => {
            this.fileUploadUrl = url;
            // Aggiorna il form con l'URL del file
            this.commessaForm.patchValue({ determinaUrl: this.fileUploadUrl });
            // Aggiorna lo stato del file
            this.uploadedFile.status = 'success';
            this.uploadedFile.url = url;
            console.log('File uploaded successfully. URL:', this.fileUploadUrl);
            Swal.fire({ title: 'File caricato con successo', icon: "success" });
          }).catch((error) => {
            this.uploadedFile.status = 'error';
            console.error('Error getting download URL: ', error);
            Swal.fire('Errore', 'Errore nel recupero dell\'URL del file.', 'error');
          });
        }
      );
    }
  }

  // Funzione per annullare l'upload (se necessario)
  cancelUpload(): void {
    // Resetta lo stato del file
    this.uploadedFile = null;
    this.selectedFile = null;

    // Se necessario, cancella anche il file da Firebase Storage (opzionale)
    if (this.uploadTask) {
      this.uploadTask.cancel();  // Cancella l'upload in corso se esiste
    }

    // Puoi anche aggiornare il form se desideri:
    this.commessaForm.patchValue({ determinaUrl: '' });
  }
}

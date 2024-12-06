import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {get, getDatabase, ref, update} from "firebase/database";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  UploadTask
} from "firebase/storage";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

declare var $: any;
@Component({
  selector: 'app-modifica-commessa',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './modifica-commessa.component.html',
  styleUrl: './modifica-commessa.component.css'
})
export class ModificaCommessaComponent implements OnInit, AfterViewInit{
  pnrrValue: string = '';
  dipendentiList: any;
  filteredDipendentiList:any;
  filteredPMList:any;
  commessaForm!: FormGroup;
  risorseForm!:FormGroup;
  responsabileForm!:FormGroup;
  misuraList: any;
  tempoList: any;
  tipoCommessaList: any;
  comuneList: any;
  loading: boolean = false;
  commessaId: string;
  competenzaFiscaleNo: boolean = false;
  dateRangeValid: boolean = false;
  years: number[] = [];
  selectedFile: File | null = null;
  fileUploadUrl: string = '';
  uploadedFile: any = null; // Oggetto per memorizzare il file caricato e il suo stato
  uploadTask: UploadTask | null = null; // Per gestire il task di upload
  selectedYears: number[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.commessaId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.initForms();
    if (this.commessaId) {
      this.loadCommessaData();
      this.getTipoComessaList();
      this.getMisuraList();
      this.getComuniList();
      this.getUserList();
      this.onCompetenzaFiscaleChange();
      this.onDateChange();
      this.checkDateRange();
      this.getTempoList();
    }
  }

  initForms() {
    this.commessaForm = this.formBuilder.group({
      nome_comune: [''],
      tipo_appalto: [''],
      importo: [''],
      data_inizio: [''],
      data_fine: [''],
      competenza_fiscale: [''],
      codice_fatturazione: [''],
      tempi_fatturazione: [''],
      metodo_fatturazione: [''],
      determina: [''],
      pnrrValue: [''],
      tipo_commessa: [''],
      misura: [''],
      pm: [''],
      cig: [''],
      descrizione_fattura: [''],
      determinaUrl: [''],
      anni: this.formBuilder.array([])
    });

    this.risorseForm = this.formBuilder.group({
      risorse: this.formBuilder.array([])
    });

    this.responsabileForm = this.formBuilder.group({
      nome_responsabile: [''],
      cognome_responsabile: [''],
      email_responsabile: [''],
      cellulare_responsabile: ['']
    });
  }

  async loadCommessaData() {
    this.loading = true;
    const dbRef = ref(getDatabase(), `lista-commesse/${this.commessaId}`);
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();

        this.commessaForm.patchValue(data.commessa);
        this.responsabileForm.patchValue(data.responsabile);

        console.log('anni',data.commessa.anni)
        // Imposta gli anni selezionati
        if (data.commessa.anni) {
          this.selectedYears = data.commessa.anni;
        }

        // Imposta le checkbox per gli anni selezionati
        this.setYearsCheckbox();

        const risorseArray = this.risorseForm.get('risorse') as FormArray;
        data.dipendenti.risorse.forEach((risorsa: any) => {
          risorseArray.push(this.createRisorsa(risorsa));
        });
      }
    } catch (error) {
      console.error("Errore nel caricamento della commessa", error);
      Swal.fire('Errore', 'Impossibile caricare i dati della commessa', 'error');
    } finally {
      this.loading = false;
    }
  }
  setYearsCheckbox(): void {
    this.years.forEach((year) => {
      if (this.selectedYears.includes(year)) {
        this.commessaForm.addControl(`year_${year}`, new FormControl(true)); // Seleziona la checkbox
      } else {
        this.commessaForm.addControl(`year_${year}`, new FormControl(false)); // Deseleziona la checkbox
      }
    });
  }
  createRisorsa(risorsaData: any): FormGroup {
    return this.formBuilder.group({
      dipendenti: [risorsaData.dipendenti || ''],
      tempo: [risorsaData.tempo || ''],
      percentuale: [risorsaData.percentuale || ''],
      mostraPercentuale: [risorsaData.mostraPercentuale || false]
    });
  }

  get risorse(): FormArray {
    return this.risorseForm.get('risorse') as FormArray;
  }

  addRisorsa() {
    this.risorse.push(this.createRisorsa({}));
  }

  removeRisorsa(index: number) {
    this.risorse.removeAt(index);
  }

  saveForm() {
    this.loading = true;
    const dbRef = ref(getDatabase(), `lista-commesse/${this.commessaId}`);
    const dataSend = {
      commessa: this.commessaForm.value,
      dipendenti: this.risorseForm.value,
      responsabile: this.responsabileForm.value
    };

    update(dbRef, dataSend)
      .then(() => {
        Swal.fire('Successo', 'Commessa aggiornata con successo', 'success');
        this.router.navigate(['/lista-commesse']);
      })
      .catch(error => {
        console.error("Errore nell'aggiornamento della commessa", error);
        Swal.fire('Errore', 'Impossibile aggiornare la commessa', 'error');
      })
      .finally(() => {
        this.loading = false;
      });
  }
  async getUserList() {
    this.loading = true;
    const usersRef = ref(database, 'users');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.dipendentiList = Object.keys(data).map(key => ({ ...data[key], id: key }));

        // Filtra qui i dipendenti per ruolo
        this.filteredDipendentiList = this.dipendentiList.filter((dipendente:any) => dipendente.role === 'dipendente');
        this.filteredPMList = this.dipendentiList.filter((dipendente:any) => dipendente.role === 'pm');


        return this.filteredDipendentiList && this.filteredPMList;
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
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
  async getMisuraList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/misura-pnrr');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.misuraList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.misuraList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  updateTempo(index: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tempo = selectElement.value;
    const risorsa = this.risorse.at(index) as FormGroup;
    risorsa.patchValue({
      mostraPercentuale: tempo === 'part'
    });
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
  removeFile(): void {
    if (this.uploadedFile && this.uploadedFile.status === 'success') {
      // Rimuovi il file da Firebase Storage
      if (this.uploadTask) {
        const fileRef = storageRef(storage, this.uploadTask.snapshot.ref.fullPath);
        deleteObject(fileRef).then(() => {
          console.log('File deleted from Firebase Storage');
          Swal.fire('File rimosso con successo', '', 'success');
        }).catch((error) => {
          console.error('Error deleting file from Firebase Storage:', error);
          Swal.fire('Errore', 'Impossibile rimuovere il file da Firebase Storage', 'error');
        });
      }

      // Resetta il file nel form e UI
      this.uploadedFile = null;
      this.selectedFile = null;
      this.commessaForm.patchValue({ determinaUrl: '' });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadFileToFirebase();
    }
  }

  uploadFileToFirebase(): void {
    if (this.selectedFile) {
      this.uploadedFile = {
        name: this.selectedFile.name,
        size: (this.selectedFile.size / (1024 * 1024)).toFixed(2), // Dimensione in MB
        status: 'uploading',
        progress: 0,
        url: ''
      };

      const filePath = `determine/${new Date().getTime()}_${this.selectedFile.name}`;
      const fileRef = storageRef(storage, filePath);

      // Caricamento del file
      this.uploadTask = uploadBytesResumable(fileRef, this.selectedFile);

      // Monitoraggio del progresso del caricamento
      this.uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadedFile.progress = progress;
          console.log('Upload progress: ', progress);
        },
        (error) => {
          this.uploadedFile.status = 'error';
          console.error('Error during file upload: ', error);
          Swal.fire('Errore', 'Errore durante il caricamento del file.', 'error');
        },
        () => {
          getDownloadURL(this.uploadTask!.snapshot.ref).then((url) => {
            this.uploadedFile.status = 'success';
            this.uploadedFile.url = url;
            this.commessaForm.patchValue({ determinaUrl: this.uploadedFile.url }); // Aggiorna l'URL nel form
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
}

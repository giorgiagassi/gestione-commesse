import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {get, getDatabase, ref, update} from "firebase/database";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../providers/auth.service";
import Swal from "sweetalert2";

const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);

@Component({
  selector: 'app-modifica-attivita-generica',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './modifica-attivita-generica.component.html',
  styleUrls: ['./modifica-attivita-generica.component.css']
})
export class ModificaAttivitaGenericaComponent implements OnInit{
  loading: boolean = false;
  role!: string;
  idUtente!:string;
  userName!: string;
  stampaForm!: FormGroup;
  risorseForm!:FormGroup;
  filteredDipendentiList:any;
  dipendentiList: any;
  commessaId!: string;
  cliente!: string;

  oggettoList:any;
  tipoStampaList:any;
  tipoAttoList:any;
  tipoSpedizioneList: any;
  vettorePostaleList:any;
  spesePostaliList:any;
  tipoAttivitaList:any;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              public formBuilder: FormBuilder,
  ) {
    this.commessaId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.userDetails();
    this.#load();
    this.getUserList();
    this.getOggettoList();
    this.getTipoStampaList();
    this.getTipoSpedizioneList();
    this.getSpeseList();
    this.getVettoreList();
    this.getTipoAttoList();
    this.getTipoAttivitaList();
    this.loadAttivitaData()

  }
  get tipoAttivita() {
    return this.stampaForm.get('tipo_attivita')?.value;
  }

  userDetails(): void {
    this.authService.getUserDetails()
    const userDetails = this.authService.getUserDetails();
    console.log(userDetails)
    if (userDetails) {
      this.role = userDetails.role;
      this.idUtente = userDetails.id;
      this.userName = `${userDetails.name} ${userDetails.surname}`;
    }
  }
  #load(): void{
    this.stampaForm = this.formBuilder.group({
      richiedente: [''],
      cliente: [''],
      oggetto: [''],
      tipo_attivita: [''],
      tipo_stampa: [''],
      tipo_atto: [''],
      tipo_spedizione: [''],
      vettore_postale: [''],
      spese_postali: [''],
      data_inizio: [''],
      data_fine: [''],
      ora_inizio: [''],
      ora_fine: [''],
      descrizione_attivita: [''],

    })

    this.risorseForm = this.formBuilder.group({
      risorse: this.formBuilder.array([])
    });


  }
  updateFormData(): void {
    // Assicurati che i form siano già inizializzati prima di chiamare patchValue
    this.stampaForm.patchValue({
      cliente: this.cliente // Aggiorna solo il cliente, o altri campi se necessario
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
    if (this.risorse.length > 1) {
      this.risorse.removeAt(index);
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
  async loadAttivitaData() {
    this.loading = true;
    const dbRef = ref(getDatabase(), `attivita/attivita-stampa/${this.commessaId}`);
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.stampaForm.patchValue(data.stampa)
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



        return this.filteredDipendentiList;
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  async loadCommessaData() {
    this.loading = true;
    const dbRef = ref(getDatabase(), `lista-commesse/${this.commessaId}`);
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.cliente = data.commessa.nome_comune
        console.log(this.cliente, 'cliente')
        console.log('data', data.commessa.nome_comune)
      }
    } catch (error) {
      console.error("Errore nel caricamento della commessa", error);
      Swal.fire('Errore', 'Impossibile caricare i dati della commessa', 'error');
    } finally {
      this.loading = false;
    }
  }

  async getOggettoList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/oggetto');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.oggettoList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.oggettoList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  async getTipoStampaList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/tipo-stampa');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tipoStampaList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.tipoStampaList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  async getTipoAttoList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/tipo-atto');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tipoAttoList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.tipoAttoList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  async getTipoSpedizioneList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/tipo-spedizione');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tipoSpedizioneList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.tipoSpedizioneList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  async getVettoreList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/vettore-postale');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.vettorePostaleList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.vettorePostaleList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  async getSpeseList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/spese-postali');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.spesePostaliList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.spesePostaliList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  async getTipoAttivitaList() {
    this.loading = true;
    const usersRef = ref(database, 'impostazioni/attivita');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tipoAttivitaList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.tipoAttivitaList
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
  }
  saveForm():void {
    this.loading = true;
    const dbRef = ref(database, `attivita/attivita-stampa/${this.commessaId}`);
    const dataSend = {
      commessa: this.commessaId,
      dipendenti: this.risorseForm.value,
      stampa: this.stampaForm.value
    };

    update(dbRef, dataSend).then(() => {
      Swal.fire({title: 'Creato con successo', icon: "success"});
      this.router.navigate(['/lista-attivita', this.commessaId]);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    }).finally(() => {
      this.loading = false;  // Nascondi lo spinner
    });
  }
}

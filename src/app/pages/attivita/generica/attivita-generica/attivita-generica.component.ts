import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../providers/auth.service";
import {get, getDatabase, push, ref} from "firebase/database";
import Swal from "sweetalert2";
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-attivita-generica',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './attivita-generica.component.html',
  styleUrl: './attivita-generica.component.css'
})
export class AttivitaGenericaComponent implements OnInit{
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

    if (this.commessaId) {
      setTimeout(async () => {
        await this.loadCommessaData();
        this.updateFormData(); // Aggiorna i form con i nuovi dati
        console.log('cliente', this.cliente);
      }, 3000); // Aggiusta il timeout secondo necessità
    }

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
      richiedente: new FormControl(this.userName),
      cliente: new FormControl(''),
      oggetto: new FormControl(''),
      tipo_attivita: new FormControl(''),
      tipo_stampa: new FormControl(''),
      tipo_atto: new FormControl(''),
      tipo_spedizione: new FormControl(''),
      vettore_postale: new FormControl(''),
      spese_postali: new FormControl(''),
      data_inizio: new FormControl(''),
      data_fine: new FormControl(''),
      ora_inizio: new FormControl(''),
      ora_fine: new FormControl(''),
      descrizione_attivita: new FormControl(''),

    })

    this.risorseForm = this.formBuilder.group({
      risorse: this.formBuilder.array([this.createRisorsa()])
    });


  }
  updateFormData(): void {
    // Assicurati che i form siano già inizializzati prima di chiamare patchValue
    this.stampaForm.patchValue({
      cliente: this.cliente // Aggiorna solo il cliente, o altri campi se necessario
    });
  }
  createRisorsa(): FormGroup {
    return this.formBuilder.group({
      dipendenti: [''],
      tempo: [''],
      percentuale:[''] || null,
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
  updateTempo(index: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tempo = selectElement.value;
    const risorsa = this.risorse.at(index) as FormGroup;
    risorsa.patchValue({
      mostraPercentuale: tempo === 'part'
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
    const dbRef = ref(database, `attivita/attivita-stampa`);
    const dataSend = {
      stato:'Assegnata',
      commessa: this.commessaId,
      dipendenti: this.risorseForm.value,
      stampa: this.stampaForm.value
    };

    push(dbRef, dataSend).then(() => {
      Swal.fire({title: 'Creato con successo', icon: "success"});
      this.router.navigate(['/lista-attivita', this.commessaId]);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    }).finally(() => {
      this.loading = false;  // Nascondi lo spinner
    });
  }
}

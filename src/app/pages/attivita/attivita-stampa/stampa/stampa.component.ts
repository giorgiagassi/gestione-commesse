import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../../providers/auth.service";
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {get, getDatabase, push, ref, update} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import Swal from "sweetalert2";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-stampa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './stampa.component.html',
  styleUrl: './stampa.component.css'
})
export class StampaComponent implements OnInit{
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

    if (this.commessaId) {
      setTimeout(async () => {
        await this.loadCommessaData();
        this.updateFormData(); // Aggiorna i form con i nuovi dati
        console.log('cliente', this.cliente);
      }, 3000); // Aggiusta il timeout secondo necessità
    }
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
      tipo_stampa: new FormControl(''),
      tipo_atto: new FormControl(''),
      tipo_spedizione: new FormControl(''),
      vettore_postale: new FormControl(''),
      spese_postali: new FormControl(''),

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
saveForm():void {
    this.loading = true;
  const dbRef = ref(database, `attivita/attivita-stampa`);
  const dataSend = {
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

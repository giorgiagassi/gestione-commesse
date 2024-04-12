import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../providers/auth.service";
import {get, getDatabase, update, ref} from "firebase/database";
import Swal from "sweetalert2";
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {NgForOf, NgIf} from "@angular/common";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-modifica-stampa',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './modifica-stampa.component.html',
  styleUrl: './modifica-stampa.component.css'
})
export class ModificaStampaComponent implements OnInit{
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
    this.getUserList();
    this.userDetails();
    this.#load();
    this.getOggettoList();
    this.getTipoStampaList();
    this.getTipoSpedizioneList();
    this.getSpeseList();
    this.getVettoreList();
    this.getTipoAttoList();
    this.loadAttivitaData()
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
      richiedente: [{value: this.userName, disabled: true}],
      cliente: [{value: '', disabled: true}],
      oggetto: [''],
      tipo_stampa: [''],
      tipo_atto: [''],
      tipo_spedizione: [''],
      vettore_postale: [''],
      spese_postali: [''],

    })

    this.risorseForm = this.formBuilder.group({
      risorse: this.formBuilder.array([])
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
        console.log('dipendenti', this.filteredDipendentiList)
      } else {

        return null;
      }
    } catch (error) {

      return null;
    }finally {
      this.loading = false; // Nascondi lo spinner
    }
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
  saveForm(): void {
    this.loading = true;
    const formData = this.stampaForm.getRawValue();  // Usa getRawValue per ottenere anche i campi disabilitati
    const dataSend = {
      commessa: this.commessaId,
      dipendenti: this.risorseForm.value,
      stampa: formData
    };

    const dbRef = ref(database, `attivita/attivita-stampa/${this.commessaId}`);
    update(dbRef, dataSend)
      .then(() => {
        Swal.fire('Successo', 'Commessa aggiornata con successo', 'success');
        this.router.navigate(['/lista-attivita', this.commessaId]);
      })
      .catch(error => {
        console.error("Errore nell'aggiornamento della commessa", error);
        Swal.fire('Errore', 'Impossibile aggiornare la commessa', 'error');
      })
      .finally(() => {
        this.loading = false;
      });
  }

}

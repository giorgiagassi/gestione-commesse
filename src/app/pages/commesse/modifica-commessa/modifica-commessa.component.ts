import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {get, getDatabase, ref, update} from "firebase/database";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);

@Component({
  selector: 'app-modifica-commessa',
  standalone: true,
    imports: [
        FormsModule,
        NgForOf,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './modifica-commessa.component.html',
  styleUrl: './modifica-commessa.component.css'
})
export class ModificaCommessaComponent implements OnInit{
  pnrrValue: string = '';
  dipendentiList: any;
  filteredDipendentiList:any;
  filteredPMList:any;
  commessaForm!: FormGroup;
  risorseForm!:FormGroup;
  responsabileForm!:FormGroup;
  misuraList: any;
  tipoCommessaList: any;
  comuneList: any;
  loading: boolean = false;
  commessaId: string;

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
    }
  }

  initForms() {
    this.commessaForm = this.formBuilder.group({
      nome_comune: [''],
      tipo_appalto: [''],
      importo: [''],
      data_inizio: [''],
      data_fine: [''],
      anni: [''],
      codice_fatturazione: [''],
      tempi_fatturazione: [''],
      determina: [''],
      pnrrValue: [''],
      tipo_commessa: [''],
      misura: [''],
      pm: ['']
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
}

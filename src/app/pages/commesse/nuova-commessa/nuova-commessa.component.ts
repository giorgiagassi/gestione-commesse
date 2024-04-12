import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {get, getDatabase, push, ref} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-nuova-commessa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule,
    NgForOf
  ],
  templateUrl: './nuova-commessa.component.html',
  styleUrl: './nuova-commessa.component.css'
})
export class NuovaCommessaComponent implements OnInit{
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
loading: boolean = false
  constructor( public formBuilder: FormBuilder,
               private router: Router,) {
  }
  ngOnInit(): void {
this.getUserList();
this.#load();
this.getTipoComessaList();
this.getMisuraList();
this.getComuniList();
  }

  async #load() {
    this.commessaForm = this.formBuilder.group({
      nome_comune: new FormControl(''),
      tipo_appalto: new FormControl(''),
      importo: new FormControl(''),
      data_inizio: new FormControl(''),
      data_fine: new FormControl(''),
      anni: new FormControl(''),
      codice_fatturazione: new FormControl(''),
      tempi_fatturazione: new FormControl(''),
      determina: new FormControl(''),
      pnrrValue: new FormControl('si'),
      tipo_commessa: new FormControl(''),
      misura: new FormControl(''),
      pm: new FormControl(''),


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

  saveForm(): void {
    this.loading = true;  // Inizia a mostrare lo spinner

    const dataSend = {
      commessa: {
        nome_comune: this.commessaForm?.get('nome_comune')!?.value || null,
        tipo_appalto: this.commessaForm?.value.tipo_appalto,
        importo: this.commessaForm?.value.importo,
        data_inizio: this.commessaForm?.value.data_inizio,
        data_fine: this.commessaForm?.value.data_fine,
        anni: this.commessaForm?.value.anni,
        codice_fatturazione: this.commessaForm?.value.codice_fatturazione,
        tempi_fatturazione: this.commessaForm?.value.tempi_fatturazione,
        determina: this.commessaForm?.value.determina,
        pnrrValue:this.commessaForm?.value.pnrrValue,
        tipo_commessa: this.commessaForm?.get('tipo_commessa')!.value || null,
        misura: this.commessaForm?.get('misura')!.value || null,
        pm: this.commessaForm?.value.pm,
      },
      dipendenti: {
        risorse: this.risorseForm!?.get('risorse')!.value || null
      },
      responsabile:{
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

}

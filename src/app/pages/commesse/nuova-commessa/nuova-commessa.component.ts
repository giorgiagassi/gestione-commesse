import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {get, getDatabase, push, ref} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {Form} from "bootstrap-italia";
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
  pnrrValue: string = 'si';
dipendentiList: any;
  selectedDipendenti: any[] = []
  filteredDipendentiList:any;
  filteredPMList:any;
commessaForm!: FormGroup;
risorseForm!:FormGroup;
responsabileForm!:FormGroup;

  constructor( public formBuilder: FormBuilder,
               private router: Router,) {
  }
  ngOnInit(): void {
    this.pnrrValue = 'si';
this.getUserList();
this.#load();
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
    const usersRef = ref(database, 'users');
    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.dipendentiList = Object.keys(data).map(key => ({ ...data[key], id: key }));

        // Filtra qui i dipendenti per ruolo
        this.filteredDipendentiList = this.dipendentiList.filter((dipendente:any) => dipendente.role === 'dipendente');
        this.filteredPMList = this.dipendentiList.filter((dipendente:any) => dipendente.role === 'pm');

        console.log('Lista dei dipendenti:', this.dipendentiList);
        return this.filteredDipendentiList && this.filteredPMList;
      } else {
        console.log('Nessuna lista dei dipendenti trovata nel database.');
        return null;
      }
    } catch (error) {
      console.error('Errore durante il recupero della lista dei dipendenti:', error);
      return null;
    }
  }

  onUserChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValues = Array.from(selectElement.selectedOptions).map(option => option.value);

    // Filtra la lista dei dipendenti basata sui valori selezionati
    this.selectedDipendenti = this.dipendentiList.filter((dipendente:any) => selectedValues.includes(dipendente.id));

    // Ora `this.selectedDipendenti` contiene gli oggetti dei dipendenti selezionati
    console.log('Dipendenti selezionati:', this.selectedDipendenti);
  }
  createRisorsa(): FormGroup {
    return this.formBuilder.group({
      dipendenti: [''],
      tempo: ['']
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
    const dataSend = {
      commessa: {
        nome_comune: this.commessaForm?.value.nome_comune,
        tipo_appalto: this.commessaForm?.value.tipo_appalto,
        importo: this.commessaForm?.value.importo,
        data_inizio: this.commessaForm?.value.data_inizio,
        data_fine: this.commessaForm?.value.data_fine,
        anni: this.commessaForm?.value.anni,
        codice_fatturazione: this.commessaForm?.value.codice_fatturazione,
        tempi_fatturazione: this.commessaForm?.value.tempi_fatturazione,
        determina: this.commessaForm?.value.determina,
        pnrrValue:this.commessaForm?.value.pnrrValue,
        tipo_commessa: this.commessaForm?.value.tipo_commessa,
        misura: this.commessaForm?.value.misura,
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
    }

    const commessaRef = ref(database, 'lista-commesse');
    push(commessaRef, dataSend).then(() => {
      console.log( dataSend, 'dati salvati con successo')
      setTimeout(() => {
        Swal.fire({title: 'Commessa creata con successo', icon: "success"});
        this.router.navigate(['/lista-commesse']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
      console.error('Error saving data:', error);  // È utile loggare l'errore
    });

  }
}

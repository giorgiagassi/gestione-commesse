import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {get, getDatabase, push, ref} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {Form} from "bootstrap-italia";
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
  dipendentiForm!: FormGroup;
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
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
      risorse: new FormControl([])

    });
  }
  ngOnInit(): void {
    this.pnrrValue = 'si';
this.getUserList();
  }
  async getUserList() {
    const usersRef = ref(database, 'users');
    try {
      const snapshot = await get(usersRef);
      if (snapshot.exists()) {
        // La lista è stata trovata nel database, puoi accedere ai dati
        const data = snapshot.val();
        this.dipendentiList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        console.log('Lista dei dipendenti:', this.dipendentiList);
        return this.dipendentiList;
      } else {
        // La lista non è stata trovata nel database
        console.log('Nessuna lista dei dipendenti trovata nel database.');
        return null;
      }
    } catch (error) {
      // Si è verificato un errore durante il recupero dei dati
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

}

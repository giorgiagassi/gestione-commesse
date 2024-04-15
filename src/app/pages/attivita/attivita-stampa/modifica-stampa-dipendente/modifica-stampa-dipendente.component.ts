import {Component, OnInit} from '@angular/core';
import {get, getDatabase, ref, update} from "firebase/database";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {ActivatedRoute, Router} from "@angular/router";
import {NgForOf} from "@angular/common";
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-modifica-stampa-dipendente',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './modifica-stampa-dipendente.component.html',
  styleUrl: './modifica-stampa-dipendente.component.css'
})
export class ModificaStampaDipendenteComponent implements OnInit{
attivitaList:any
  tipoRitiroList:any
  loading: boolean = false;
  commessaId!: string;

  consegnaForm!:FormGroup;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public formBuilder: FormBuilder,
  ) {
    this.commessaId = this.route.snapshot.paramMap.get('id') || '';
  }
  ngOnInit(): void {
    this.loadAttivitaData();
    this.#load();
    this.getOggettoList()
  }

  #load(): void {
    this.consegnaForm! = this.formBuilder.group({
      quantita_stampata: new FormControl(''),
      data_stampa: new FormControl(''),
      tipo_ritiro: new FormControl(''),
      quantita_ritirata: new FormControl(''),
      data_ritiro: new FormControl(''),
      data_accettazione: new FormControl(''),
    })
  }
  async loadAttivitaData() {
    this.loading = true;
    const dbRef = ref(getDatabase(), `attivita/attivita-stampa/${this.commessaId}`);
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.attivitaList = data.stampa
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
    const usersRef = ref(database, 'impostazioni/tipo-ritiro');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tipoRitiroList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        return this.tipoRitiroList
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
    const dbRef = ref(getDatabase(), `attivita/attivita-stampa/${this.commessaId}/consegna`);

    // Prendi i dati dal form di consegna
    const formConsegnaData = this.consegnaForm.value;

    // Usa update per aggiungere/modificare solo i dati di consegna senza toccare altri dati
    update(dbRef, formConsegnaData)
      .then(() => {
        Swal.fire('Successo', 'Dati aggiunti con successo all\'attività di stampa', 'success');
        this.router.navigate(['/lista-attivita', this.commessaId]);
      })
      .catch(error => {
        console.error("Errore nell'aggiornamento dell'attività di stampa", error);
        Swal.fire('Errore', 'Impossibile aggiornare i dati dell\'attività di stampa', 'error');
      })
      .finally(() => {
        this.loading = false;
      });
  }

}

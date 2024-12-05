import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {getDatabase, push, ref} from "firebase/database";
import Swal from "sweetalert2";
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-nuovo-tempo',
  standalone: true,
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './nuovo-tempo.component.html',
  styleUrl: './nuovo-tempo.component.css'
})
export class NuovoTempoComponent implements OnInit{
  comuniForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.comuniForm = this.formBuilder.group({
      nome_tempo: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      nome_tempo: this.comuniForm?.value.nome_tempo,
    }
    const comuniRef = ref(database, 'impostazioni/tempi-fatturazione');
    push(comuniRef, dataSend).then(() => {
      console.log( dataSend, 'dati salvati con successo')
      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/tempi']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
      console.error('Error saving data:', error);  // È utile loggare l'errore
    });
  }
}

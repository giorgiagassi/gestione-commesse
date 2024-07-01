import {Component, OnInit} from '@angular/core';
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {getDatabase, push, ref} from "firebase/database";
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-nuova-attivita',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './nuova-attivita.component.html',
  styleUrl: './nuova-attivita.component.css'
})
export class NuovaAttivitaComponent implements OnInit{
  tipoCommessaForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.tipoCommessaForm = this.formBuilder.group({
      nome_attivita: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      nome_attivita: this.tipoCommessaForm?.value.nome_attivita,
    }
    const tipoCommessaRef = ref(database, 'impostazioni/attivita');
    push(tipoCommessaRef, dataSend).then(() => {

      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/attivita']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
}

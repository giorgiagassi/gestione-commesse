import {Component, OnInit} from '@angular/core';
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {getDatabase, push, ref} from "firebase/database";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-nuovo-tipo-commessa',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuovo-tipo-commessa.component.html',
  styleUrl: './nuovo-tipo-commessa.component.css'
})
export class NuovoTipoCommessaComponent implements OnInit{
  tipoCommessaForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.tipoCommessaForm = this.formBuilder.group({
      tipo_commessa: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      tipo_commessa: this.tipoCommessaForm?.value.tipo_commessa,
    }
    const tipoCommessaRef = ref(database, 'impostazioni/tipo-commessa');
    push(tipoCommessaRef, dataSend).then(() => {

      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/tipo-commessa']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
}

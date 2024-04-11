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
  selector: 'app-nuovo-tipo-atto',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuovo-tipo-atto.component.html',
  styleUrl: './nuovo-tipo-atto.component.css'
})
export class NuovoTipoAttoComponent implements OnInit{
  tipoAttoForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.tipoAttoForm = this.formBuilder.group({
      tipo_atto: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      tipo_atto: this.tipoAttoForm?.value.tipo_atto,
    }
    const tipoAttoRef = ref(database, 'impostazioni/tipo-atto');
    push(tipoAttoRef, dataSend).then(() => {

      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/tipo-atto']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
}

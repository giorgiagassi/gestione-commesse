import { Component } from '@angular/core';
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {getDatabase, push, ref} from "firebase/database";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-nuovo-tipo-ritiro',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuovo-tipo-ritiro.component.html',
  styleUrl: './nuovo-tipo-ritiro.component.css'
})
export class NuovoTipoRitiroComponent {
  RitiroForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.RitiroForm = this.formBuilder.group({
      tipo_ritiro: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      tipo_ritiro: this.RitiroForm?.value.tipo_ritiro,
    }
    const RitiroRef = ref(database, 'impostazioni/tipo-ritiro');
    push(RitiroRef, dataSend).then(() => {

      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/tipo-ritiro']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
}

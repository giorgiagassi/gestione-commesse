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
  selector: 'app-nuovo-tipo-spedizione',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuovo-tipo-spedizione.component.html',
  styleUrl: './nuovo-tipo-spedizione.component.css'
})
export class NuovoTipoSpedizioneComponent implements OnInit{
  tipoSpedizioneForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.tipoSpedizioneForm = this.formBuilder.group({
      tipo_spedizione: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      tipo_spedizione: this.tipoSpedizioneForm?.value.tipo_spedizione,
    }
    const tipoSpedizioneRef = ref(database, 'impostazioni/tipo-spedizione');
    push(tipoSpedizioneRef, dataSend).then(() => {

      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/tipo-spedizione']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
}

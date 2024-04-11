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
  selector: 'app-nuovo-tipo-stampa',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuovo-tipo-stampa.component.html',
  styleUrl: './nuovo-tipo-stampa.component.css'
})
export class NuovoTipoStampaComponent implements OnInit{
  tipoStampaForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.tipoStampaForm = this.formBuilder.group({
      tipo_stampa: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      tipo_stampa: this.tipoStampaForm?.value.tipo_stampa,
    }
    const tipoStampaRef = ref(database, 'impostazioni/tipo-stampa');
    push(tipoStampaRef, dataSend).then(() => {

      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/tipo-stampa']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
}

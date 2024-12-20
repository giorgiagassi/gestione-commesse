import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {getDatabase, push, ref} from "firebase/database";
import Swal from "sweetalert2";
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-nuovo-appalto',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './nuovo-appalto.component.html',
  styleUrl: './nuovo-appalto.component.css'
})
export class NuovoAppaltoComponent implements OnInit{
  comuniForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.comuniForm = this.formBuilder.group({
      nome_appalto: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      nome_appalto: this.comuniForm?.value.nome_appalto,
      codice: this.comuniForm?.value.codice,
    }
    const comuniRef = ref(database, 'impostazioni/tipologia-appalto');
    push(comuniRef, dataSend).then(() => {
      console.log( dataSend, 'dati salvati con successo')
      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/tipologia-appalto']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
      console.error('Error saving data:', error);  // È utile loggare l'errore
    });
  }
}

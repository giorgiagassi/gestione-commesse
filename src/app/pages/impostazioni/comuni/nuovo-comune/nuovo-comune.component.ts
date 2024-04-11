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
  selector: 'app-nuovo-comune',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './nuovo-comune.component.html',
  styleUrl: './nuovo-comune.component.css'
})
export class NuovoComuneComponent implements OnInit{
comuniForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
  this.#load()
  }
  async #load(){
  this.comuniForm = this.formBuilder.group({
    nome_comune: new FormControl(''),
  })
  }

  saveForm():void {
  const dataSend = {
    nome_comune: this.comuniForm?.value.nome_comune,
  }
    const comuniRef = ref(database, 'impostazioni/comuni');
    push(comuniRef, dataSend).then(() => {
      console.log( dataSend, 'dati salvati con successo')
      setTimeout(() => {
        Swal.fire({title: 'Comune creato con successo', icon: "success"});
        this.router.navigate(['/comuni']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
      console.error('Error saving data:', error);  // È utile loggare l'errore
    });
  }
}

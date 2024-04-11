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
  selector: 'app-nuovo-vettore-postale',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuovo-vettore-postale.component.html',
  styleUrl: './nuovo-vettore-postale.component.css'
})
export class NuovoVettorePostaleComponent implements OnInit{
  vettoreForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
    private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.vettoreForm = this.formBuilder.group({
      vettore_postale: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      vettore_postale: this.vettoreForm?.value.vettore_postale,
    }
    const vettoreRef = ref(database, 'impostazioni/vettore-postale');
    push(vettoreRef, dataSend).then(() => {

      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/vettore-postale']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
}


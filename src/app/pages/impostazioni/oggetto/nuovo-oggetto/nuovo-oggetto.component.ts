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
  selector: 'app-nuovo-oggetto',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuovo-oggetto.component.html',
  styleUrl: './nuovo-oggetto.component.css'
})
export class NuovoOggettoComponent implements OnInit{
  oggettoForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.oggettoForm = this.formBuilder.group({
      oggetto: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      oggetto: this.oggettoForm?.value.oggetto,
    }
    const oggettoRef = ref(database, 'impostazioni/oggetto');
    push(oggettoRef, dataSend).then(() => {
      console.log( dataSend, 'dati salvati con successo')
      setTimeout(() => {
        Swal.fire({title: 'Oggetto creato con successo', icon: "success"});
        this.router.navigate(['/oggetto']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
      console.error('Error saving data:', error);  // È utile loggare l'errore
    });
  }


}

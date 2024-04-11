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
  selector: 'app-nuove-spese-postali',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuove-spese-postali.component.html',
  styleUrl: './nuove-spese-postali.component.css'
})
export class NuoveSpesePostaliComponent implements OnInit{
  spesePostaliForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.spesePostaliForm = this.formBuilder.group({
      spese_postali: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      spese_postali: this.spesePostaliForm?.value.spese_postali,
    }
    const spesePostaliRef = ref(database, 'impostazioni/spese-postali');
    push(spesePostaliRef, dataSend).then(() => {

      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/spese-postali']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
}

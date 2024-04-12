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
  selector: 'app-nuovo-misura-pnrr',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './nuovo-misura-pnrr.component.html',
  styleUrl: './nuovo-misura-pnrr.component.css'
})
export class NuovoMisuraPnrrComponent implements OnInit{
  misuraForm!: FormGroup

  constructor(public formBuilder: FormBuilder,
              private router: Router,) {
  }

  ngOnInit(): void {
    this.#load()
  }
  async #load(){
    this.misuraForm = this.formBuilder.group({
      misura_pnrr: new FormControl(''),
    })
  }

  saveForm():void {
    const dataSend = {
      misura_pnrr: this.misuraForm?.value.misura_pnrr,
    }
    const misuraRef = ref(database, 'impostazioni/misura-pnrr');
    push(misuraRef, dataSend).then(() => {

      setTimeout(() => {
        Swal.fire({title: 'Creato con successo', icon: "success"});
        this.router.navigate(['/misura-pnrr']);
      }, 2000);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
}

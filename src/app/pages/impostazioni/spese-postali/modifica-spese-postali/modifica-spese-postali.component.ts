import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {get, getDatabase, ref, set} from "firebase/database";
import Swal from "sweetalert2";

@Component({
  selector: 'app-modifica-spese-postali',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modifica-spese-postali.component.html',
  styleUrl: './modifica-spese-postali.component.css'
})
export class ModificaSpesePostaliComponent implements OnInit{
  spesePostaliForm!: FormGroup;
  id: string | null = null;
  constructor(public formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,) {
  }
  ngOnInit(): void {
    this.#load();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.loadComuneData(this.id);
      }
    });
  }
  async #load(){
    this.spesePostaliForm = this.formBuilder.group({
      spese_postali: new FormControl(''),
    })
  }
  loadComuneData(id: string) {
    const db = getDatabase();
    const hunterRef = ref(db, 'impostazioni/spese-postali/' + id);
    get(hunterRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.spesePostaliForm.patchValue(data);
      } else {
        Swal.fire('Errore ID non trovato', id , 'error');
      }
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    });
  }
  saveForm() {
    if (this.id) {
      const db = getDatabase();
      const hunterRef = ref(db, 'impostazioni/spese-postali/' + this.id);
      set(hunterRef, this.spesePostaliForm.value).then(() => {
        Swal.fire({title: 'Oggetto modificato con successo', icon: "success"});

        setTimeout(() => {
          this.router.navigate(['/spese-postali']);
        }, 3000);
      }).catch((error:any) => {
        Swal.fire('Errore', error.message, 'error');

      });
    }
  }
}

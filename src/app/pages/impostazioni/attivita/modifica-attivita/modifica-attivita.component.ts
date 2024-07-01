import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {get, getDatabase, ref, set} from "firebase/database";
import Swal from "sweetalert2";

@Component({
  selector: 'app-modifica-attivita',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './modifica-attivita.component.html',
  styleUrl: './modifica-attivita.component.css'
})
export class ModificaAttivitaComponent implements OnInit{
  tipoCommessaForm!: FormGroup;
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
    this.tipoCommessaForm = this.formBuilder.group({
      nome_attivita: new FormControl(''),
    })
  }
  loadComuneData(id: string) {
    const db = getDatabase();
    const hunterRef = ref(db, 'impostazioni/attivita/' + id);
    get(hunterRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tipoCommessaForm.patchValue(data);
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
      const hunterRef = ref(db, 'impostazioni/attivita/' + this.id);
      set(hunterRef, this.tipoCommessaForm.value).then(() => {
        Swal.fire({title: ' modificato con successo', icon: "success"});

        setTimeout(() => {
          this.router.navigate(['/attivita']);
        }, 3000);
      }).catch((error:any) => {
        Swal.fire('Errore', error.message, 'error');

      });
    }
  }
}

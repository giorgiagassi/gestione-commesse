import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {get, getDatabase, ref, set} from "firebase/database";
import Swal from "sweetalert2";

@Component({
  selector: 'app-modifica-tipo-commessa',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modifica-tipo-commessa.component.html',
  styleUrl: './modifica-tipo-commessa.component.css'
})
export class ModificaTipoCommessaComponent implements OnInit{
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
      tipo_commessa: new FormControl(''),
    })
  }
  loadComuneData(id: string) {
    const db = getDatabase();
    const hunterRef = ref(db, 'impostazioni/tipo-commessa/' + id);
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
      const hunterRef = ref(db, 'impostazioni/tipo-commessa/' + this.id);
      set(hunterRef, this.tipoCommessaForm.value).then(() => {
        Swal.fire({title: 'modificato con successo', icon: "success"});

        setTimeout(() => {
          this.router.navigate(['/tipo-commessa']);
        }, 3000);
      }).catch((error:any) => {
        Swal.fire('Errore', error.message, 'error');

      });
    }
  }
}

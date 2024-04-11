import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {get, getDatabase, ref, set} from "firebase/database";
import Swal from "sweetalert2";

@Component({
  selector: 'app-modifica-tipo-ritiro',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './modifica-tipo-ritiro.component.html',
  styleUrl: './modifica-tipo-ritiro.component.css'
})
export class ModificaTipoRitiroComponent implements OnInit{

  tipoRitiroForm!: FormGroup;
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
    this.tipoRitiroForm = this.formBuilder.group({
      tipo_ritiro: new FormControl(''),
    })
  }
  loadComuneData(id: string) {
    const db = getDatabase();
    const hunterRef = ref(db, 'impostazioni/tipo-ritiro/' + id);
    get(hunterRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.tipoRitiroForm.patchValue(data);
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
      const hunterRef = ref(db, 'impostazioni/tipo-ritiro/' + this.id);
      set(hunterRef, this.tipoRitiroForm.value).then(() => {
        Swal.fire({title: 'Oggetto modificato con successo', icon: "success"});

        setTimeout(() => {
          this.router.navigate(['/tipo-ritiro']);
        }, 3000);
      }).catch((error:any) => {
        Swal.fire('Errore', error.message, 'error');

      });
    }
  }
}

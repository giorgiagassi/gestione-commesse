import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { getDatabase, ref, get, update } from "firebase/database";
import { initializeApp } from "firebase/app";
import { environment } from "../../../../enviroments/enviroments";
import { AuthService } from "../../../../providers/auth.service";
import Swal from "sweetalert2";
import { NgForOf, NgIf } from "@angular/common";
import { ToggleButtonModule } from "primeng/togglebutton";

const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);

@Component({
  selector: 'app-modifica-contabilita',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    ToggleButtonModule
  ],
  templateUrl: './modifica-contabilita.component.html',
  styleUrls: ['./modifica-contabilita.component.css']
})
export class ModificaContabilitaComponent implements OnInit {
  loading: boolean = false;
  role!: string;
  idUtente!: string;
  modificaForm!: FormGroup;
  commessaId!: string;
  contabilitaId!: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              public formBuilder: FormBuilder) {
    this.commessaId = this.route.snapshot.paramMap.get('commessaId') || '';
    this.contabilitaId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.userDetails();
    this.loadForm();
    this.loadContabilita();

    if (this.commessaId) {
      setTimeout(async () => {
      }, 3000); // Aggiusta il timeout secondo necessità
    }
  }

  userDetails(): void {
    const userDetails = this.authService.getUserDetails();
    console.log(userDetails);
    if (userDetails) {
      this.role = userDetails.role;
      this.idUtente = userDetails.id;
    }
  }

  loadForm(): void {
    this.modificaForm = this.formBuilder.group({
      n_fattura: new FormControl(''),
      importo: new FormControl(''),
      descrizione: new FormControl(''),
      data_inizio: new FormControl(''),
      data_fine: new FormControl(''),
      pagato: new FormControl(false),
    });
  }

  async loadContabilita(): Promise<void> {
    const contabilitaRef = ref(database, `contabilita/${this.contabilitaId}`);
    try {
      const snapshot = await get(contabilitaRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log('Dati contabilità:', data); // Log dei dati caricati
        this.modificaForm.patchValue({
          n_fattura: data.contabilita.n_fattura,
          importo: data.contabilita.importo,
          descrizione: data.contabilita.descrizione,
          data_inizio: data.contabilita.data_inizio,
          data_fine: data.contabilita.data_fine,
          pagato: data.contabilita.pagato,
        });
      } else {
        console.error('Nessun dato trovato per la contabilità con ID:', this.contabilitaId);
      }
    } catch (error) {
      console.error('Errore durante il caricamento della contabilità:', error);
    }
  }

  async saveForm(): Promise<void> {
    this.loading = true;
    const contabilitaRef = ref(database, `contabilita/${this.contabilitaId}`);
    const dataSend = {
      contabilita: this.modificaForm.value
    };

    try {
      await update(contabilitaRef, dataSend);
      Swal.fire({ title: 'Modificato con successo', icon: "success" });
      this.router.navigate(['/lista-contabilita', this.commessaId]);
    } catch (error) {
      Swal.fire('Errore', (error as Error).message, 'error');
    } finally {
      this.loading = false;
    }
  }
}

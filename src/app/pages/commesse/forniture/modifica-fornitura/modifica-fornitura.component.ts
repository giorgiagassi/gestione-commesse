import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../providers/auth.service";
import { getDatabase, ref, get, update } from "firebase/database";
import Swal from "sweetalert2";
import { initializeApp } from "firebase/app";
import { environment } from "../../../../enviroments/enviroments";
import { ToggleButtonModule } from "primeng/togglebutton";
import { MessageService } from "primeng/api";
import { NgForOf, NgIf } from "@angular/common";

const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);

@Component({
  selector: 'app-modifica-fornitura',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToggleButtonModule,
    NgIf,
    NgForOf
  ],
  providers: [MessageService],
  templateUrl: './modifica-fornitura.component.html',
  styleUrls: ['./modifica-fornitura.component.css']
})
export class ModificaFornituraComponent implements OnInit {
  loading: boolean = false;
  role!: string;
  idUtente!: string;
  fornituraForm!: FormGroup;
  commessaId!: string;
  fornituraId!: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              public formBuilder: FormBuilder,
              private messageService: MessageService) {
    this.commessaId = this.route.snapshot.paramMap.get('commessaId') || '';
    this.fornituraId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.userDetails();
    this.loadForm();
    this.loadFornitura();

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
    this.fornituraForm = this.formBuilder.group({
      quantita: new FormControl(''),
      n_ddt: new FormControl(''),
      destinatario: new FormControl(''),
      destinazione: new FormControl(''),
      causale: new FormControl(''),
      colli: new FormControl(''),
      aspetto: new FormControl(''),
      cura: new FormControl(''),
      data_consegna: new FormControl(''),
      ora_consegna: new FormControl(''),
      dettagli: this.formBuilder.array([])
    });
  }

  get dettagli(): FormArray {
    return this.fornituraForm.get('dettagli') as FormArray;
  }

  addDettaglio(): void {
    this.dettagli.push(this.formBuilder.group({
      descrizione: new FormControl(''),
      seriale: new FormControl(''),
      consegnato: new FormControl(false)
    }));
  }

  removeDettaglio(index: number): void {
    this.dettagli.removeAt(index);
  }

  async loadFornitura(): Promise<void> {
    const fornituraRef = ref(database, `forniture/${this.fornituraId}`);
    try {
      const snapshot = await get(fornituraRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.fornituraForm.patchValue({
          quantita: data.fornitura.quantita,
          n_ddt: data.fornitura.n_ddt,
          destinatario: data.fornitura.destinatario,
          destinazione: data.fornitura.destinazione,
          causale: data.fornitura.causale,
          colli: data.fornitura.colli,
          aspetto: data.fornitura.aspetto,
          cura: data.fornitura.cura,
          data_consegna: data.fornitura.data_consegna,
          ora_consegna: data.fornitura.ora_consegna
        });
        data.fornitura.dettagli.forEach((dettaglio: any) => {
          const dettaglioGroup = this.formBuilder.group({
            descrizione: new FormControl(dettaglio.descrizione),
            seriale: new FormControl(dettaglio.seriale),
            consegnato: new FormControl(dettaglio.consegnato)
          });
          this.dettagli.push(dettaglioGroup);
        });
      }
    } catch (error) {
      console.error('Errore durante il caricamento della fornitura:', error);
    }
  }

  async updateForm(): Promise<void> {
    this.loading = true;
    const fornituraRef = ref(database, `forniture/${this.fornituraId}`);
    const dataSend = {
      commessa: this.commessaId,
      fornitura: this.fornituraForm.value
    };

    try {
      await update(fornituraRef, dataSend);
      Swal.fire({ title: 'Modificato con successo', icon: "success" });
      this.router.navigate(['/lista-forniture', this.commessaId]);
    } catch (error) {
      Swal.fire('Errore', (error as Error).message, 'error');
    } finally {
      this.loading = false;
    }
  }

}

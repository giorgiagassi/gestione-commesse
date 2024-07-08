import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../providers/auth.service";
import { getDatabase, push, ref, get, set } from "firebase/database";
import Swal from "sweetalert2";
import { initializeApp } from "firebase/app";
import { environment } from "../../../../enviroments/enviroments";
import { ToggleButtonModule } from "primeng/togglebutton";
import { MessageService } from "primeng/api";
import { NgForOf, NgIf } from "@angular/common";

const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);

@Component({
  selector: 'app-nuova-fornitura',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToggleButtonModule,
    NgIf,
    NgForOf
  ],
  providers: [MessageService],
  templateUrl: './nuova-fornitura.component.html',
  styleUrls: ['./nuova-fornitura.component.css']
})
export class NuovaFornituraComponent implements OnInit {
  loading: boolean = false;
  role!: string;
  idUtente!: string;
  fornituraForm!: FormGroup;
  commessaId!: string;
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              public formBuilder: FormBuilder,
              private messageService: MessageService) {
    this.commessaId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.userDetails();
    this.loadForm();
    this.generateNDDT();

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
    this.addDettaglio();
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

  async generateNDDT(): Promise<void> {
    const nddtRef = ref(database, 'lastNDDT');
    try {
      const snapshot = await get(nddtRef);
      let lastNDDT = 0;

      if (snapshot.exists()) {
        const data = snapshot.val();
        const year = data.split('/')[1];
        if (parseInt(year) === this.currentYear) {
          lastNDDT = parseInt(data.split('/')[0]);
        }
      }

      const newNDDT = `${lastNDDT + 1}/${this.currentYear}`;
      this.fornituraForm.patchValue({ n_ddt: newNDDT });
      await set(nddtRef, newNDDT);
    } catch (error) {
      console.error('Errore durante la generazione del numero DDT:', error);
    }
  }

  async saveForm(): Promise<void> {
    this.loading = true;
    const dbRef = ref(database, `forniture`);
    const dataSend = {
      commessa: this.commessaId,
      fornitura: this.fornituraForm.value
    };

    try {
      await push(dbRef, dataSend);
      Swal.fire({ title: 'Creato con successo', icon: "success" });
      this.router.navigate(['/lista-forniture', this.commessaId]);
    } catch (error) {
      Swal.fire('Errore', (error as Error).message, 'error');
    } finally {
      this.loading = false;
    }
  }


}

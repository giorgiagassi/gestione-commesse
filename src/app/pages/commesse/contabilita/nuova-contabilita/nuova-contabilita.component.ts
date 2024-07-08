import {Component, OnInit} from '@angular/core';
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {get, getDatabase, push, ref} from "firebase/database";
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../providers/auth.service";
import Swal from "sweetalert2";
import {NgForOf, NgIf} from "@angular/common";
import {ToggleButtonModule} from "primeng/togglebutton";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-nuova-contabilita',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    ToggleButtonModule
  ],
  templateUrl: './nuova-contabilita.component.html',
  styleUrl: './nuova-contabilita.component.css'
})
export class NuovaContabilitaComponent implements OnInit{
  loading: boolean = false;
  role!: string;
  idUtente!:string;
  stampaForm!: FormGroup;
  risorseForm!:FormGroup;
  filteredDipendentiList:any;
  commessaId!: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              public formBuilder: FormBuilder,
  ) {
    this.commessaId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.userDetails();
    this.#load();

    if (this.commessaId) {
      setTimeout(async () => {
      }, 3000); // Aggiusta il timeout secondo necessità
    }

  }

  userDetails(): void {
    this.authService.getUserDetails()
    const userDetails = this.authService.getUserDetails();
    console.log(userDetails)
    if (userDetails) {
      this.role = userDetails.role;
      this.idUtente = userDetails.id;
    }
  }
  #load(): void{
    this.stampaForm = this.formBuilder.group({
      n_fattura: new FormControl(''),
      importo: new FormControl(''),
      descrizione: new FormControl(''),
      data_inizio: new FormControl(''),
      data_fine: new FormControl(''),
      pagato: new FormControl(false),

    })

  }


  saveForm():void {
    this.loading = true;
    const dbRef = ref(database, `contabilita`);
    const dataSend = {
      commessa: this.commessaId,
      contabilita: this.stampaForm.value
    };

    push(dbRef, dataSend).then(() => {
      Swal.fire({title: 'Creato con successo', icon: "success"});
      this.router.navigate(['/lista-contabilita', this.commessaId]);
    }).catch((error) => {
      Swal.fire('Errore', error.message, 'error');
    }).finally(() => {
      this.loading = false;  // Nascondi lo spinner
    });
  }
}

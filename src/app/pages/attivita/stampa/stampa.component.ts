import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../providers/auth.service";
import {FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {get, getDatabase, ref} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../enviroments/enviroments";
import {NgForOf, NgIf} from "@angular/common";
import {Router} from "@angular/router";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
@Component({
  selector: 'app-stampa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './stampa.component.html',
  styleUrl: './stampa.component.css'
})
export class StampaComponent implements OnInit{
  userName: string = '';
  role:string = '';
  dipendentiList: any;
  filteredDipendentiList:any;
  risorseForm!:FormGroup;
  attivitaForm!:FormGroup;
  commessa:any;
  commesseList:any;
  commessaSelezionata: any;
commessaID!: string;
  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder,
    private router: Router) {
    this.loadCommessaDetail();
  }

  async ngOnInit(): Promise<void> {
    this.loadUserDetails();
    this.getUserList();
    await this.getCommesseList();
    this.getCommessaFromState();
  }
  loadUserDetails() {
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.userName = `${userDetails.name} ${userDetails.surname}`;
      this.role = userDetails.role
    }
    this.#load()
  }
  async getUserList() {
    const usersRef = ref(database, 'users');
    try {
      const snapshot = await get(usersRef!);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.dipendentiList = Object.keys(data).map(key => ({ ...data[key], id: key }));

        // Filtra qui i dipendenti per ruolo
        this.filteredDipendentiList = this.dipendentiList.filter((dipendente:any) => dipendente.role === 'dipendente');

        console.log('Lista dei dipendenti:', this.dipendentiList);
        return this.filteredDipendentiList
      } else {
        console.log('Nessuna lista dei dipendenti trovata nel database.');
        return null;
      }
    } catch (error) {
      console.error('Errore durante il recupero della lista dei dipendenti:', error);
      return null;
    }
  }
  async #load() {
    this.attivitaForm = this.formBuilder.group({
      userName:[this.userName],
      nome_comune:[this.commessaSelezionata!.commessa!.nome_comune]


    })

    this.risorseForm = this.formBuilder.group({
      risorse: this.formBuilder.array([this.createRisorsa()])
    });

  }
  createRisorsa(): FormGroup {
    return this.formBuilder.group({
      dipendenti: [''],
      tempo: [''],
      percentuale:[''] || null,
      mostraPercentuale: [false]
    });
  }

  get risorse(): FormArray {
    return this.risorseForm.get('risorse') as FormArray;
  }

  addRisorsa() {
    this.risorse.push(this.createRisorsa());
  }

  removeRisorsa(index: number) {
    if (this.risorse.length > 1) {
      this.risorse.removeAt(index);
    }
  }

  updateTempo(index: number, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const tempo = selectElement.value;
    const risorsa = this.risorse.at(index) as FormGroup;
    risorsa.patchValue({
      mostraPercentuale: tempo === 'part'
    });
  }

  loadCommessaDetail(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { [key: string]: any };
    if (state) {
      this.commessaID = state['commessaId'];
      console.log(this.commessaID, 'commessaID');
    }
  }

  async getCommesseList() {
    const database = getDatabase();
    const huntersRef = ref(database, 'lista-commesse');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.commesseList = Object.keys(data).map(key => ({ ...data[key], id: key }));
        console.log('Lista delle commesse:', this.commesseList);
      } else {
        console.log('Nessuna lista delle commesse trovata nel database.');
      }
    } catch (error) {
      console.error('Errore durante il recupero della lista delle commesse:', error);
    }
  }

  getCommessaFromState() {

      this.commessaSelezionata = this.commesseList!?.find((commessa:any) => commessa.id === this.commessaID);
      console.log('Commessa selezionata:', this.commessaSelezionata);
    }


}

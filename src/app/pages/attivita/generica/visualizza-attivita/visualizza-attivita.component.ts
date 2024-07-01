import {Component, OnInit} from '@angular/core';
import {DatePipe, NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../providers/auth.service";
import {FormBuilder} from "@angular/forms";
import {get, getDatabase, ref, update} from "firebase/database";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import {jsPDF} from "jspdf";
import {getDownloadURL, getStorage, ref as storageRef, uploadBytes} from "firebase/storage";

@Component({
  selector: 'app-visualizza-attivita',
  standalone: true,
  imports: [
    DatePipe,
    NgOptimizedImage
  ],
  templateUrl: './visualizza-attivita.component.html',
  styleUrl: './visualizza-attivita.component.css'
})
export class VisualizzaAttivitaComponent implements OnInit {
  attivitaList: any
  consegnaList: any;
  loading: boolean = false;
  commessaId!: string;
  userName!: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              public formBuilder: FormBuilder,
  ) {
    this.commessaId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit(): void {
    this.loadAttivitaData();
    this.userDetails();
  }

  async loadAttivitaData() {
    this.loading = true;
    const dbRef = ref(getDatabase(), `attivita/attivita-stampa/${this.commessaId}`);
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        this.attivitaList = data.stampa;
        this.consegnaList = data.consegna;
      }
    } catch (error) {
      console.error("Errore nel caricamento della commessa", error);
      Swal.fire('Errore', 'Impossibile caricare i dati della commessa', 'error');
    } finally {
      this.loading = false;
    }
  }

  userDetails(): void {
    this.authService.getUserDetails();
    const userDetails = this.authService.getUserDetails();
    // Usa direttamente console.log senza riferimenti a Node.js
    if (userDetails) {
      this.userName = `${userDetails.name} ${userDetails.surname}`;
    }
  }


  terminaAttivita(): void {
    this.loading = true;
    const statoRef = ref(getDatabase(), `attivita/attivita-stampa/${this.commessaId}/`);
    // Dati da aggiornare per lo stato
    const updateStatoData = { stato: 'Terminata' };

    // Effettua gli aggiornamenti
    Promise.all([
      update(statoRef, updateStatoData)
    ])
      .then(() => {
        Swal.fire('Successo', 'Dati aggiunti con successo all\'attività di stampa', 'success');
        this.router.navigate(['/lista-attivita', this.commessaId]);
      })
      .catch(error => {
        console.error("Errore nell'aggiornamento dell'attività di stampa", error);
        Swal.fire('Errore', 'Impossibile aggiornare i dati dell\'attività di stampa', 'error');
      })
      .finally(() => {
        this.loading = false;
      });
  }
  presaVisione(): void {
    this.loading = true;
    const statoRef = ref(getDatabase(), `attivita/attivita-stampa/${this.commessaId}/`);
    // Dati da aggiornare per lo stato
    const updateStatoData = { stato: 'In Lavorazione' };

    // Effettua gli aggiornamenti
    Promise.all([
      update(statoRef, updateStatoData)
    ])
      .then(() => {
        Swal.fire('Successo', 'Dati aggiunti con successo all\'attività di stampa', 'success');
        this.router.navigate(['/lista-attivita', this.commessaId]);
      })
      .catch(error => {
        console.error("Errore nell'aggiornamento dell'attività di stampa", error);
        Swal.fire('Errore', 'Impossibile aggiornare i dati dell\'attività di stampa', 'error');
      })
      .finally(() => {
        this.loading = false;
      });
  }


}


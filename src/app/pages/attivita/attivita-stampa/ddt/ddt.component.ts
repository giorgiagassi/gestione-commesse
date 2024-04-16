import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../providers/auth.service";
import {FormBuilder} from "@angular/forms";
import {get, getDatabase, ref, update} from "firebase/database";
import Swal from "sweetalert2";
import {DatePipe, NgOptimizedImage} from "@angular/common";
import html2canvas from "html2canvas";
import { jsPDF } from 'jspdf';
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
const app = initializeApp(environment.firebaseConfig);


@Component({
  selector: 'app-ddt',
  standalone: true,
  imports: [
    NgOptimizedImage,
    DatePipe
  ],
  templateUrl: './ddt.component.html',
  styleUrl: './ddt.component.css'
})
export class DdtComponent implements OnInit {
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

  printPage() {
    const data = document.getElementById('content-to-print');
    if (data) {
      html2canvas(data).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 208;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Genera un nome di file dinamico basato sull'ID della commessa e sulla data
        const fileName = `PDF_${this.commessaId}_${new Date().toISOString().slice(0,10)}.pdf`;

        // Crea un Blob del PDF
        const pdfBlob = pdf.output('blob');

        // Salvare il PDF localmente
        pdf.save(fileName); // Salva il file PDF con il nome generato dinamicamente

        // Riferimento a Firebase Storage per caricare il PDF
        const pdfRef = storageRef(getStorage(), `pdfs/${fileName}`);
        uploadBytes(pdfRef, pdfBlob).then(snapshot => {
          return getDownloadURL(snapshot.ref);
        }).then(downloadURL => {
          this.savePDFLink(downloadURL);
          Swal.fire('Successo', 'PDF aggiunto con successo', 'success');

          // Apri il PDF in una nuova scheda per la stampa
          const url = window.URL.createObjectURL(pdfBlob);
          window.open(url, '_blank')!.focus();

        }).catch(error => {
          Swal.fire('Errore', 'Impossibile caricare il PDF', 'error');
        });
      });
    }
  }

  savePDFLink(url:any): void {
    this.loading = true;
    const dbRef = ref(getDatabase(), `attivita/attivita-stampa/${this.commessaId}/ddt`);

    // Prendi i dati dal form di consegna
    const formConsegnaData = { pdfUrl: url }

    // Usa update per aggiungere/modificare solo i dati di consegna senza toccare altri dati
    update(dbRef, formConsegnaData)
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

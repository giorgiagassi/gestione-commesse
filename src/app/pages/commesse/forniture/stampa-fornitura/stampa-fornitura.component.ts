import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { getDatabase, ref, get } from "firebase/database";
import { initializeApp } from "firebase/app";
import { environment } from "../../../../enviroments/enviroments";
import {DatePipe, NgForOf} from "@angular/common";

const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);

@Component({
  selector: 'app-stampa-fornitura',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf
  ],
  templateUrl: './stampa-fornitura.component.html',
  styleUrls: ['./stampa-fornitura.component.css']
})
export class StampaFornituraComponent implements OnInit {
  customer: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.customer = navigation.extras.state['customer'];
    }
  }

  ngOnInit(): void {
    if (!this.customer) {
      // Handle the case where customer is not passed through state
      console.error('Nessun dato di customer trovato.');
    }
  }

  printPage(): void {
    const printContents = document.querySelector('.printable')?.innerHTML;
    if (printContents) {
      const popupWin = window.open('', '_blank', 'width=800,height=600');
      popupWin?.document.open();
      popupWin?.document.write(`
        <html>
          <head>
            <title>Stampa</title>
            <style>
              @media print {
                body {
                  margin: 30px;
                  padding: 30px;
                  box-sizing: border-box;
                }
                .printable {
                  width: 100%;
                  position: relative;
                  margin: 20mm; /* Margini per la stampa */
                }
                .row {
                  display: flex;
                  flex-wrap: wrap;
                  margin: 0 -15px;
                }
                .row > * {
                  flex: 1 1 auto;
                  padding: 15px;
                }
                .text-end {
                  text-align: right;
                }
                .table {
                  width: 100%;
                  margin-bottom: 1rem;
                  color: #212529;
                  border-collapse: collapse;
                }
                .table th,
                .table td {
                  padding: 0.75rem;
                  vertical-align: top;
                  border-top: 1px solid #dee2e6;
                }
                .table thead th {
                  vertical-align: bottom;
                  border-bottom: 2px solid #dee2e6;
                }
                .table tbody + tbody {
                  border-top: 2px solid #dee2e6;
                }
                .table-bordered {
                  border: 1px solid #dee2e6;
                }
                .table-bordered th,
                .table-bordered td {
                  border: 1px solid #dee2e6;
                }
                .table-bordered thead th,
                .table-bordered thead td {
                  border-bottom-width: 2px;
                }
                .signature-space {
                  margin-top: 50px; /* Spazio tra le firme */
                }
              }
            </style>
          </head>
          <body onload="window.print(); window.close();">
            ${printContents}
            <div class="signature-space"></div>
            <div class="row justify-content-end">
              FIRMA CONDUCENTE
            </div>
            <div class="signature-space"></div>
            <div class="row justify-content-end">
              FIRMA DESTINATARIO
            </div>
          </body>
        </html>
      `);
      popupWin?.document.close();
    } else {
      console.error('Errore durante il recupero del contenuto da stampare.');
    }
  }

}

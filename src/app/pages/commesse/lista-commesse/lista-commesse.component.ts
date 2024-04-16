import {Component, OnInit, ViewChild} from '@angular/core';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import {environment} from "../../../enviroments/enviroments";
import {Router, RouterLink} from "@angular/router";
import {Table, TableModule} from "primeng/table";

const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
import { remove } from 'firebase/database';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {AuthService} from "../../../providers/auth.service";
import {DatePipe, NgIf} from "@angular/common";
@Component({
  selector: 'app-lista-commesse',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    RouterLink,
    NgIf,
    DatePipe
  ],
  templateUrl: './lista-commesse.component.html',
  styleUrl: './lista-commesse.component.css'
})
export class ListaCommesseComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  commesseList:any;
  loading: boolean = false;
  role!: string;
  idUtente!:string;
  constructor(private router: Router,
              private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.getCommesseList();
    this.userDetails();

  }
userDetails(): void {
    this.authService.getUserDetails()
  const userDetails = this.authService.getUserDetails();
  if (userDetails) {
    this.role = userDetails.role
    this.idUtente = userDetails.id
  }
}
  async getCommesseList() {
    const huntersRef = ref(database, 'lista-commesse');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        // Stampa i valori per ogni chiave per comprendere meglio i dati
        Object.keys(data).forEach(key => {
        });

        // Applica il filtro e la mappatura se necessario
        if (this.role === 'dipendente') {
          this.commesseList = Object.keys(data)
            .filter(key =>
              data[key].dipendenti?.risorse.some((r:any) => r.dipendenti === this.idUtente)
            )
            .map(key => ({ ...data[key], id: key }));
        } else {
          this.commesseList = Object.keys(data)
            .map(key => ({ ...data[key], id: key }));
        }
        console.log(this.commesseList)
        return this.commesseList;

      } else {

        return null;
      }
    } catch (error) {

      return null;
    }
  }

  editCustomer(customer: any) {

    this.router.navigate(['/modifica-commessa', customer.id]);
  }
  deleteCustomer(customer: any) {

    const customerRef = ref(database, `lista-commesse/${customer.id}`);

    remove(customerRef).then(() => {
      this.commesseList = this.commesseList.filter((item: any) => item.id !== customer.id);

    }).catch((error:any) => {
    });
  }

  attivitaCustomer(customer: any) {

    this.router.navigate(['/lista-attivita', customer.id]);
  }

}

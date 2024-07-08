import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {AuthService} from "../../../../providers/auth.service";
import {SharedService} from "../../../../providers/shared.service";
import {get, getDatabase, ref, remove, update} from "firebase/database";
import {initializeApp} from "firebase/app";
import {environment} from "../../../../enviroments/enviroments";
import {ButtonModule} from "primeng/button";
import {DatePipe, NgIf} from "@angular/common";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {ToggleButtonModule} from "primeng/togglebutton";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import {ProgressSpinnerModule} from "primeng/progressspinner";
const app = initializeApp(environment.firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
@Component({
  selector: 'app-lista-forniture',
  standalone: true,
  imports: [
    ButtonModule,
    DatePipe,
    NgIf,
    SharedModule,
    TableModule,
    ToggleButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './lista-forniture.component.html',
  styleUrl: './lista-forniture.component.css'
})
export class ListaFornitureComponent implements OnInit{
  @ViewChild('dt1') dt1: any;
  attivitaList:any;
  checked: boolean = false;
  role!: string;
  idUtente!:string;
  selectedFile: File | null = null;
  selectedCustomer: any = null;
  loading: boolean = false;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private sharedService: SharedService
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
    const huntersRef = ref(database, 'forniture');
    try {
      const snapshot = await get(huntersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const customerId = this.sharedService.getCustomerId(); // Recupera l'ID del cliente

        // Crea una lista temporanea per le attività filtrate
        let tempAttivitaList = [];


        tempAttivitaList = Object.keys(data)
          .map(key => ({ ...data[key], id: key }));

        // Ordinamento dal più recente al meno recente basato su ID
        tempAttivitaList.sort((a, b) => {
          return b.id.localeCompare(a.id);
        });
        // Filtra la lista in base all'ID del cliente sotto la voce commessa, se disponibile
        if (customerId) {
          this.attivitaList = tempAttivitaList.filter((attivita: any) => attivita.commessa === customerId);
        } else {
          this.attivitaList = tempAttivitaList;
        }


        console.log(this.attivitaList, 'forniture')
        return this.attivitaList;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  editCustomer(customer: any) {

    this.router.navigate(['/modifica-fornitura', customer.id]);
  }


  deleteCustomer(customer: any) {
    // Assicurati di avere un DatabaseReference corretto
    const customerRef = ref(database, `forniture/${customer.id}`);

    remove(customerRef).then(() => {
      // Rimuovi l'elemento dall'array per aggiornare l'UI
      this.attivitaList = this.attivitaList.filter((item: any) => item.id !== customer.id);
      console.log('Commessa eliminato con successo');
    }).catch((error:any) => {
      console.error('Errore durante l/eliminazione della commessa:', error);
    });
  }

  stampaCustomer() {
    const commessaId = this.route.snapshot.paramMap.get('id'); // Assumendo che 'id' sia il nome del parametro nella rotta
    this.router.navigate(['/nuova-fornitura/',  commessaId]);
    console.log(commessaId, 'commessaID')
  }

  stampaPDF(customer:any): void {
    const navigationExtras: NavigationExtras = {
      state: { customer: customer }
    };
    this.router.navigate(['/stampa-fornitura'], navigationExtras );
  }

  selectCustomerForUpload(customer: any): void {
    this.selectedCustomer = customer;
    document.getElementById(`file-upload-${customer.id}`)?.click();
  }

  onFileSelected(event: any, customer: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.uploadFile(customer);
    }
  }

  async uploadFile(customer: any): Promise<void> {
    if (!this.selectedFile) {
      return;
    }

    this.loading = true; // Inizia il caricamento
    const filePath = `ddt_firmato/${customer.id}_${this.selectedFile.name}`;
    const fileRef = storageRef(storage, filePath);

    try {
      await uploadBytes(fileRef, this.selectedFile);
      const downloadURL = await getDownloadURL(fileRef);

      // Aggiorna il database con il link al file
      const fornituraRef = ref(database, `forniture/${customer.id}`);
      const dataSend = {
        ...customer,
        fornitura: {
          ...customer.fornitura,
          ddt_firmato: downloadURL
        }
      };

      await update(fornituraRef, dataSend);
      Swal.fire({ title: 'File caricato con successo', icon: "success" });

      // Aggiorna la lista attività con il nuovo link
      const index = this.attivitaList.findIndex((item: any) => item.id === customer.id);
      if (index !== -1) {
        this.attivitaList[index].fornitura.ddt_firmato = downloadURL;
      }
    } catch (error) {
      console.error('Errore durante il caricamento del file:', error);
      Swal.fire('Errore', 'Errore durante il caricamento del file', 'error');
    } finally {
      this.loading = false; // Fine del caricamento
      this.selectedFile = null;
      this.selectedCustomer = null;
    }
  }

  viewSignedDDT(ddtFirmatoUrl: string): void {
    window.open(ddtFirmatoUrl, '_blank');
  }
}


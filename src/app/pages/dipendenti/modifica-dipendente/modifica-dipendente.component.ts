import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import Swal from "sweetalert2";
import {ActivatedRoute} from "@angular/router";
import {get, getDatabase, ref, update} from "firebase/database";
@Component({
  selector: 'app-modifica-dipendente',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './modifica-dipendente.component.html',
  styleUrl: './modifica-dipendente.component.css'
})
export class ModificaDipendenteComponent implements OnInit {
  id: string | null = null;
  name: string = '';
  surname: string = '';
  email: string = '';
  role: string = '';
  loading: boolean = false;

  constructor( private route: ActivatedRoute) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadUserData(this.id);
    }
  }

  async loadUserData(id: string) {
    try {
      const db = getDatabase();
      const userRef = ref(db, 'users/' + id);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const user = snapshot.val();
        this.name = user.name;
        this.surname = user.surname;
        this.email = user.email;

        this.role = user.role;
      } else {
        Swal.fire({ icon: 'error', text: 'Utente non trovato.' });
      }
    } catch (error) {
      console.error("Errore durante il caricamento dei dati dell'utente", error);
      Swal.fire({ icon: 'error', text: 'Errore durante il caricamento dei dati dell\'utente.' });
    }
  }

  async onRegister() {
    this.loading = true;
    if (!this.name || !this.surname || !this.email || !this.role ) {
      Swal.fire({ icon: 'error', text: 'Per favore, completa tutti i campi.' });
      this.loading = false;
      return;
    }

    try {
      const db = getDatabase();

      // Riferimenti per entrambe le tabelle
      const updates: any = {};
      updates['/users/' + this.id] = {
        name: this.name,
        surname: this.surname,
        email: this.email,
        role: this.role
      };

      // Esegui l'aggiornamento atomico per entrambe le tabelle
      await update(ref(db), updates);

      Swal.fire({ icon: 'success', text: 'Dati utente  aggiornati con successo.' });
    } catch (error) {
      console.error("Errore durante l'aggiornamento dei dati dell'utente", error);
      Swal.fire({ icon: 'error', text: 'Errore durante l\'aggiornamento dei dati dell\'utente.' });
    } finally {
      this.loading = false;
    }
  }
}

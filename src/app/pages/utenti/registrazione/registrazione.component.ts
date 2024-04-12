import { Component } from '@angular/core';
import {AuthService} from "../../../providers/auth.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-registrazione',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './registrazione.component.html',
  styleUrl: './registrazione.component.css'
})
export class RegistrazioneComponent {
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
loading: boolean = false;
  constructor(private authService: AuthService) {}

  async onRegister() {
    this.loading= true
    if (!this.name || !this.surname || !this.email || !this.password || !this.role) {
      console.error("Per favore, completa tutti i campi.");
      return;
    }

    try {
      await this.authService.createUser(this.name, this.surname, this.email, this.password, this.role);

    } catch (error) {
      console.error("Errore durante la registrazione", error);
      // Gestisci gli errori qui, ad esempio mostrando un messaggio all'utente
    }finally {
      this.loading = false;
    }
  }
}

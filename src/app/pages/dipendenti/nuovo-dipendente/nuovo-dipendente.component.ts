import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../providers/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nuovo-dipendente',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './nuovo-dipendente.component.html',
  styleUrl: './nuovo-dipendente.component.css'
})
export class NuovoDipendenteComponent {
  name: string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  role: string = '';

  constructor(private authService: AuthService,
              private router: Router) {}

  async onRegister() {
    if (!this.name || !this.surname || !this.email || !this.password || !this.role) {
      console.error("Per favore, completa tutti i campi.");
      return;
    }

    try {
      await this.authService.createUser(this.name, this.surname, this.email, this.password, this.role);
      this.router.navigate(['/lista-dipendenti']);
      // La navigazione a 'home' o altra logica può essere gestita qui o all'interno di createUser
    } catch (error) {
      console.error("Errore durante la registrazione", error);
      // Gestisci gli errori qui, ad esempio mostrando un messaggio all'utente
    }
  }
}

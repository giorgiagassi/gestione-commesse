import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../providers/auth.service";
import {CardModule} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {NgOptimizedImage} from "@angular/common";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CardModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    MenubarModule,
    NgOptimizedImage
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email!: string;
  password!: string;

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.SignIn(this.email, this.password).then(() => {
      // Il messaggio di successo può essere gestito all'interno di SignIn
    }).catch((error) => {
      // Gli errori possono essere gestiti all'interno di SignIn
    });
  }
  items: MenuItem[] | undefined;


}

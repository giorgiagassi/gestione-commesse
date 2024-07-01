import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../providers/auth.service";
import {CardModule} from "primeng/card";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {ButtonModule} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {NgOptimizedImage} from "@angular/common";
import {MenuItem} from "primeng/api";
import {Router} from "@angular/router";

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
export class LoginComponent implements OnInit{
  email!: string;
  password!: string;
  loading: boolean = false
  role!: string;
  idUtente!:string;
  constructor(private authService: AuthService,
              private router: Router,) {}

  ngOnInit(): void {

  }
  onLogin() {
    this.loading = true;

    this.authService.SignIn(this.email, this.password).then(() => {
      this.userDetails();
      this.loading= false

      if (this.role == 'dipendente'){
        this.router.navigate(['/lista-attivita']);
      } else {
        this.router.navigate(['/lista-commesse']);
      }

      // Il messaggio di successo può essere gestito all'interno di SignIn
    }).catch((error) => {
      // Gli errori possono essere gestiti all'interno di SignIn
    });
  }
  items: MenuItem[] | undefined;

  userDetails(): void {
    this.authService.getUserDetails()
    const userDetails = this.authService.getUserDetails();
    if (userDetails) {
      this.role = userDetails.role
      this.idUtente = userDetails.id
    }
  }



}

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private customerId!: string;

  setCustomerId(id: string) {
    this.customerId = id;
  }

  getCustomerId(): string {
    return this.customerId;
  }
}

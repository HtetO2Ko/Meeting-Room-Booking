import { Injectable, signal } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class AuthContextService {
  readonly userId = signal<number>(0);

  setUserId(id: number) {
    this.userId.set(id);
  }
}

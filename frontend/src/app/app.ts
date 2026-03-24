import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  mostrarNavbar = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.mostrarNavbar = this.router.url !== '/';
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Rol {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
  ],
  templateUrl: './roles.html',
})
export class RolesComponent implements OnInit {
  private refreshRoles$ = new BehaviorSubject<void>(undefined);

  roles$: Observable<Rol[]> = this.refreshRoles$.pipe(
    switchMap(() => this.api.getRoles()),
    map((roles) => roles.sort((a: Rol, b: Rol) => a.nombre.localeCompare(b.nombre))),
  );

  columnas: string[] = ['nombre', 'acciones'];

  nuevoRol = {
    nombre: '',
  };

  editando = false;
  rolEditandoId: number | null = null;

  constructor(
    private api: Api,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {}

  editarRol(rol: Rol) {
    this.nuevoRol.nombre = rol.nombre;

    this.editando = true;
    this.rolEditandoId = rol.id;
  }

  guardarRol() {
    if (this.editando && this.rolEditandoId !== null) {
      this.api.updateRol(this.rolEditandoId, this.nuevoRol).subscribe({
        next: () => {
          this.snackBar.open('Rol actualizado correctamente', 'Cerrar', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.resetFormulario();
          this.refreshRoles$.next();
        },
        error: (err) => console.error(err),
      });
    } else {
      this.api.createRol(this.nuevoRol).subscribe({
        next: () => {
          this.snackBar.open('Rol creado correctamente', 'Cerrar', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.resetFormulario();
          this.refreshRoles$.next();
        },
        error: (err) => console.error(err),
      });
    }
  }

  eliminarRol(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este rol?')) return;

    this.api.deleteRol(id).subscribe({
      next: () => {
        this.refreshRoles$.next();

        this.snackBar.open('Rol eliminado correctamente', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: () => {
        this.snackBar.open('Error al eliminar rol', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  resetFormulario() {
    this.nuevoRol.nombre = '';

    this.editando = false;
    this.rolEditandoId = null;
  }
}

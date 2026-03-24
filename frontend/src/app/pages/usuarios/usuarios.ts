import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { MatTableModule } from '@angular/material/table';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol?: { id: number; nombre: string };
}

interface Rol {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
  ],
  templateUrl: './usuarios.html',
})
export class UsuariosComponent implements OnInit {
  private refreshUsuarios$ = new BehaviorSubject<void>(undefined);

  usuarios$: Observable<Usuario[]> = this.refreshUsuarios$.pipe(
    switchMap(() => this.api.getUsuarios()),
    map((usuarios) =>
      usuarios.sort((a: { nombre: string }, b: { nombre: any }) =>
        a.nombre.localeCompare(b.nombre),
      ),
    ),
  );

  roles$!: Observable<Rol[]>;

  columnas: string[] = ['nombre', 'email', 'rol', 'acciones'];

  nuevoUsuario = {
    nombre: '',
    email: '',
    rolId: null as number | null,
  };

  mensaje = '';

  editando = false;
  usuarioEditandoId: number | null = null;

  constructor(
    private api: Api,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.roles$ = this.api.getRoles();
  }

  editarUsuario(usuario: Usuario) {
    this.nuevoUsuario.nombre = usuario.nombre;
    this.nuevoUsuario.email = usuario.email;
    this.nuevoUsuario.rolId = usuario.rol?.id || null;

    this.editando = true;
    this.usuarioEditandoId = usuario.id;
  }

  guardarUsuario() {
    if (this.editando && this.usuarioEditandoId !== null) {
      this.api.updateUsuario(this.usuarioEditandoId, this.nuevoUsuario).subscribe({
        next: () => {
          this.snackBar.open('Usuario actualizado correctamente', 'Cerrar', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.resetFormulario();
          this.refreshUsuarios$.next();
        },
        error: (err: any) => console.error(err),
      });
    } else {
      this.api.createUsuario(this.nuevoUsuario).subscribe({
        next: () => {
          this.snackBar.open('Usuario creado correctamente', 'Cerrar', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.resetFormulario();
          this.refreshUsuarios$.next();
        },
        error: (err: any) => console.error(err),
      });
    }
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.api.deleteUsuario(id).subscribe({
      next: () => {
        this.refreshUsuarios$.next();

        this.snackBar.open('Usuario eliminado correctamente', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: () => {
        this.snackBar.open('Error al eliminar usuario', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  resetFormulario() {
    this.nuevoUsuario.nombre = '';
    this.nuevoUsuario.email = '';
    this.nuevoUsuario.rolId = null;

    this.editando = false;
    this.usuarioEditandoId = null;
  }
}

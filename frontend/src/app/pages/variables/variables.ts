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
import { MatSelectModule } from '@angular/material/select';

interface Variable {
  id: number;
  nombre: string;
  valor: string;
  tipo: string;
}

@Component({
  selector: 'app-variables',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSnackBarModule,
  ],
  templateUrl: './variables.html',
})
export class VariablesComponent implements OnInit {
  private refreshVariables$ = new BehaviorSubject<void>(undefined);

  variables$: Observable<Variable[]> = this.refreshVariables$.pipe(
    switchMap(() => this.api.getVariables()),
    map((variables) =>
      variables.sort((a: Variable, b: Variable) => a.nombre.localeCompare(b.nombre)),
    ),
  );

  columnas: string[] = ['nombre', 'valor', 'tipo', 'acciones'];

  nuevaVariable = {
    nombre: '',
    valor: '',
    tipo: '',
  };

  editando = false;
  variableEditandoId: number | null = null;

  constructor(
    private api: Api,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {}

  editarVariable(variable: Variable) {
    this.nuevaVariable.nombre = variable.nombre;

    this.editando = true;
    this.variableEditandoId = variable.id;
  }

  guardarVariable() {
    if (this.editando && this.variableEditandoId !== null) {
      this.api.updateVariable(this.variableEditandoId, this.nuevaVariable).subscribe({
        next: () => {
          this.snackBar.open('Variable actualizada correctamente', 'Cerrar', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.resetFormulario();
          this.refreshVariables$.next();
        },
        error: (err) => console.error(err),
      });
    } else {
      this.api.createVariable(this.nuevaVariable).subscribe({
        next: () => {
          this.snackBar.open('Variable creada correctamente', 'Cerrar', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });

          this.resetFormulario();
          this.refreshVariables$.next();
        },
        error: (err) => console.error(err),
      });
    }
  }

  eliminarVariable(id: number) {
    if (!confirm('¿Seguro que deseas eliminar esta variable?')) return;

    this.api.deleteVariable(id).subscribe({
      next: () => {
        this.refreshVariables$.next();

        this.snackBar.open('Variable eliminada correctamente', 'Cerrar', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      },
      error: () => {
        this.snackBar.open('Error al eliminar variable', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  resetFormulario() {
    this.nuevaVariable = {
      nombre: '',
      valor: '',
      tipo: '',
    };

    this.editando = false;
    this.variableEditandoId = null;
  }
}

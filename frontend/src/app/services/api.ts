import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private baseUrl = 'http://localhost:5057/api';

  constructor(private http: HttpClient) {}

  // USUARIOS

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Usuarios`);
  }

  createUsuario(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Usuarios`, data);
  }

  updateUsuario(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/Usuarios/${id}`, {
      ...data,
      id,
    });
  }

  deleteUsuario(id: number) {
    return this.http.delete(`${this.baseUrl}/Usuarios/${id}`);
  }

  // ROLES

  getRoles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Roles`);
  }

  createRol(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Roles`, data);
  }

  updateRol(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/Roles/${id}`, {
      ...data,
      id,
    });
  }

  deleteRol(id: number) {
    return this.http.delete(`${this.baseUrl}/Roles/${id}`);
  }

  // VARIABLES

  getVariables(): Observable<any> {
    return this.http.get(`${this.baseUrl}/Variables`);
  }

  createVariable(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/Variables`, data);
  }

  updateVariable(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/Variables/${id}`, {
      ...data,
      id,
    });
  }

  deleteVariable(id: number) {
    return this.http.delete(`${this.baseUrl}/Variables/${id}`);
  }
}

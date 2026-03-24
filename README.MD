# Panel de Administración (Usuarios, Roles y Variables)

Aplicación Full Stack para la gestión de usuarios, roles y variables.

---

# Tecnologías utilizadas

### Backend

- ASP.NET Core
- Entity Framework Core
- MariaDB (Docker)
- Pomelo.EntityFrameworkCore.MySql

### Frontend

- Angular
- Angular Material

---

## Funcionalidades

- CRUD de Usuarios
- CRUD de Roles
- CRUD de Variables

## Base de Datos

La base de datos se gestiona mediante **Entity Framework Core**, utilizando el contexto:

public class AppDbContext : DbContext
{
public DbSet<Usuario> Usuarios { get; set; }
public DbSet<Rol> Roles { get; set; }
public DbSet<Variable> Variables { get; set; }
}

Las tablas se crean automáticamente a partir de este modelo.

Configuración de Base de Datos (MariaDB)

1. Levantar MariaDB con Docker
   docker run -d \
    --name mariadb-test \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=paneldb \
    -p 3307:3306 \
    mariadb

O de la siguiente manera:

docker run -d --name mariadb-test -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=backenddb -p 3306:3306 mariadb:latest

2. Configurar conexión en backend

Editar appsettings.json:

"ConnectionStrings": {
"DefaultConnection": "server=localhost;port=3307;database=paneldb;user=root;password=root"
}

3. Configuración en Program.cs

Asegurarse de tener:

builder.Services.AddDbContext<AppDbContext>(options =>
options.UseMySql(
builder.Configuration.GetConnectionString("DefaultConnection"),
ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
)
);

4. Crear base de datos

Ejecutar en backend:

dotnet ef database update

Esto generará automáticamente las tablas:

Usuarios
Roles
Variables

API Endpoints

Usuarios
GET /api/Usuarios
POST /api/Usuarios
PUT /api/Usuarios/{id}
DELETE /api/Usuarios/{id}
Roles
GET /api/Roles
POST /api/Roles
PUT /api/Roles/{id}
DELETE /api/Roles/{id}
Variables
GET /api/Variables
POST /api/Variables
PUT /api/Variables/{id}
DELETE /api/Variables/{id}

Frontend (Angular)

1. Ir a carpeta frontend
   cd frontend
2. Instalar dependencias
   npm install
3. Ejecutar aplicación
   ng serve

Aplicación disponible en:

http://localhost:4200

Backend

Ejecutar:

cd backend
dotnet run

Disponible en:
http://localhost:5057

Se utilizó Entity Framework Core para facilitar la gestión del modelo de datos.
Las migraciones permiten crear la base de datos automáticamente sin necesidad de scripts SQL.
El uso de Docker permite levantar rápidamente la base de datos en cualquier entorno.

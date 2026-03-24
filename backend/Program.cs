using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

app.MapControllers();


using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    context.Database.EnsureCreated();

    if (!context.Roles.Any())
    {
        context.Roles.AddRange(
            new Rol { Nombre = "Administrador" },
            new Rol { Nombre = "Usuario" }
        );
        context.SaveChanges();
    }

    if (!context.Variables.Any())
    {
        context.Variables.AddRange(
            new Variable { Nombre = "edad_minima", Valor = "18", Tipo = "number" },
            new Variable { Nombre = "sistema_activo", Valor = "true", Tipo = "boolean" }
        );
        context.SaveChanges();
    }

    if (!context.Usuarios.Any())
    {
        var rol = context.Roles.First();

        context.Usuarios.AddRange(
            new Usuario
            {
                Nombre = "Admin",
                Email = "admin@test.com",
                RolId = rol.Id
            },
            new Usuario
            {
                Nombre = "Usuario",
                Email = "usuario@test.com",
                RolId = rol.Id
            }
        );
        context.SaveChanges();
    }
}

app.Run();
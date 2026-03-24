using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly AppDbContext _context;

    public RolesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Rol>>> GetRoles()
    {
        return await _context.Roles.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Rol>> CreateRol(Rol rol)
    {
        _context.Roles.Add(rol);
        await _context.SaveChangesAsync();
        return rol;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRol(int id, Rol rol)
    {
        if (id != rol.Id)
            return BadRequest("El ID no coincide");

        var rolExistente = await _context.Roles.FindAsync(id);
        if (rolExistente == null)
            return NotFound();

        // actualizar campos
        rolExistente.Nombre = rol.Nombre;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRol(int id)
    {
        var rol = await _context.Roles.FindAsync(id);

        if (rol == null)
            return NotFound();

        _context.Roles.Remove(rol);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
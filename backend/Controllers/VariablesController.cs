using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VariablesController : ControllerBase
{
    private readonly AppDbContext _context;

    public VariablesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Variable>>> GetVariables()
    {
        return await _context.Variables.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<Variable>> CreateVariable(Variable variable)
    {
        _context.Variables.Add(variable);
        await _context.SaveChangesAsync();
        return variable;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateVariable(int id, Variable variable)
    {
        if (id != variable.Id)
            return BadRequest();

        _context.Entry(variable).State = EntityState.Modified;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteVariable(int id)
    {
        var variable = await _context.Variables.FindAsync(id);

        if (variable == null)
            return NotFound();

        _context.Variables.Remove(variable);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
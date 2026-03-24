using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Usuario
{
    public int Id { get; set; }

    [Required]
    public string Nombre { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    public int RolId { get; set; }

    public Rol? Rol { get; set; }
}
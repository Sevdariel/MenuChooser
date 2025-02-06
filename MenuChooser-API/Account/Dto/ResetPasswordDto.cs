using System.ComponentModel.DataAnnotations;

namespace Account.Dto
{
    public class ResetPasswordDto
    {
        public required string Token { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        [Compare("Password")]
        public required string ConfirmPassword { get; set; }
    }
}

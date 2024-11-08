using System.ComponentModel.DataAnnotations;

namespace Account.Dto
{
    public class ForgotPasswordDto
    {
        [EmailAddress]
        public required string Email { get; set; }

        public required string ClientURI { get; set; }
    }
}

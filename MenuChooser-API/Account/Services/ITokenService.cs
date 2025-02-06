using Users.Entities;

namespace Account.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
        string CreatePasswordResetTokenAsync(User user);
        bool ValidatePasswordResetToken(string token);
    }
}

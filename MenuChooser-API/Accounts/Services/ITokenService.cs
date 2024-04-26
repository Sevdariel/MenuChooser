using MenuChooser.Entities;

namespace MenuChooser.Accounts.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}

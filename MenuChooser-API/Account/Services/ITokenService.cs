using Users.Entities;

namespace Account.Services
{
    public interface ITokenService
    {
        string CreateToken(User user);
    }
}

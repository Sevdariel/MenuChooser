using Users.Entities;

namespace Account.Services
{
    public interface IAccountService
    {
        bool AccountExist(string email);
        Task RegisterUser(User user);
        bool UsernameTaken(string username);
        bool IsPasswordUnchanged(byte[] oldHash, byte[] newHash);
    }
}
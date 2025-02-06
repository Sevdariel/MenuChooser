using Users.Entities;

namespace Users.Service
{
    public interface IUserService
    {
        Task<List<User>> GetUsersAsync();

        Task<User?> GetUserByEmailAsync(string email);

        User GetUserByEmail(string email);

        Task CreateUserAsync(User newUser);

        Task UpdateUserAsync(User updatedUser);

        Task RemoveUserAsync(string email);
    }
}
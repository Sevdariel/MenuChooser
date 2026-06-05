using System.Security.Cryptography;
using System.Text;
using Users.Entities;
using Users.Service;

namespace Users.Seeder;

public class UserSeeder(IUserService userService)
{
    public async Task SeedAsync()
    {
        var existingUsers = await userService.GetUsersAsync();
        if (existingUsers.Any())
        {
            Console.WriteLine("Users already seeded. Skipping...");
            return;
        }

        var users = GetUsers();

        foreach (var user in users)
        {
            await userService.CreateUserAsync(user);
        }

        Console.WriteLine($"Seeded {users.Count} users");
    }

    private static List<User> GetUsers()
    {
        var users = new List<User>();

        // Admin user
        users.Add(CreateUser(
            email: "admin@menuchooser.com",
            username: "Admin",
            password: "Admin123!"
        ));

        // Test users
        users.Add(CreateUser(
            email: "user1@test.com",
            username: "TestUser1",
            password: "Test123!"
        ));

        users.Add(CreateUser(
            email: "user2@test.com",
            username: "TestUser2",
            password: "Test123!"
        ));

        users.Add(CreateUser(
            email: "zali2008@wp.pl",
            username: "Sevdariel",
            password: "nixdorf"
        ));

        return users;
    }

    private static User CreateUser(string email, string username, string password)
    {
        using var hmac = new HMACSHA512();

        return new User
        {
            Email = email,
            Username = username,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password)),
            PasswordSalt = hmac.Key,
            TermsOfUse = true,
            PrivacyPolicy = true
        };
    }
}

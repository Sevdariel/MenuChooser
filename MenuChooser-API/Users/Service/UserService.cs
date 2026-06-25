using System.Globalization;
using Database.Data;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Users.Entities;

namespace Users.Service
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _userCollection;
        private readonly ILogger<UserService> _logger;

        public UserService(MongoDBContext databaseInitializer, ILogger<UserService> logger)
        {
            _userCollection = databaseInitializer.GetMongoDatabase().GetCollection<User>(MongoDBExtensions.CollectionName(GetType().Name));
            _logger = logger;
        }

        public async Task<List<User>> GetUsersAsync()
        {
            try
            {
                _logger.LogDebug("Fetching all users");
                var users = await _userCollection.Find(_ => true).ToListAsync();
                _logger.LogDebug("Retrieved {UserCount} users", users.Count);
                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all users");
                throw;
            }
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            try
            {
                _logger.LogDebug("Fetching user by email: {Email}", email);
                return await _userCollection.Find(x => x.Email == email).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user by email: {Email}", email);
                throw;
            }
        }

        public User GetUserByEmail(string email)
        {
            try
            {
                _logger.LogDebug("Fetching user by email (sync): {Email}", email);
                return _userCollection.Find(email).FirstOrDefault();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching user by email (sync): {Email}", email);
                throw;
            }
        }

        public async Task CreateUserAsync(User newUser)
        {
            try
            {
                _logger.LogInformation("Creating user: {Username}", newUser.Username);
                await _userCollection.InsertOneAsync(newUser);
                _logger.LogInformation("User created successfully: {Email}", newUser.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user: {Username}", newUser.Username);
                throw;
            }
        }

        public async Task UpdateUserAsync(User updatedUser)
        {
            try
            {
                _logger.LogInformation("Updating user: {Email}", updatedUser.Email);
                await _userCollection.ReplaceOneAsync(user => user.Email == updatedUser.Email, updatedUser);
                _logger.LogInformation("User updated successfully: {Email}", updatedUser.Email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating user: {Email}", updatedUser.Email);
                throw;
            }
        }

        public async Task RemoveUserAsync(string email)
        {
            try
            {
                _logger.LogInformation("Removing user: {Email}", email);
                await _userCollection.DeleteOneAsync(x => x.Email == email);
                _logger.LogInformation("User removed successfully: {Email}", email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error removing user: {Email}", email);
                throw;
            }
        }
    }
}

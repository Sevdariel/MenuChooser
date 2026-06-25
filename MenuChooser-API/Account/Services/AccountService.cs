using Database.Data;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using Users.Entities;

namespace Account.Services
{
    public class AccountService : IAccountService
    {
        private readonly IMongoCollection<User> _userCollection;
        private readonly ILogger<AccountService> _logger;

        public AccountService(MongoDBContext databaseContext, ILogger<AccountService> logger)
        {
            _userCollection = databaseContext.GetMongoDatabase().GetCollection<User>("User");
            _logger = logger;
        }

        public bool AccountExist(string email)
        {
            try
            {
                var exists = _userCollection.Find(user => user.Email == email).Any();
                _logger.LogDebug("Account existence check for email {Email}: {Exists}", email, exists);
                return exists;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking account existence for email: {Email}", email);
                throw;
            }
        }
        
        public async Task RegisterUser(User user)
        {
            try
            {
                _logger.LogInformation("Registering user: {Username}", user.Username);
                await _userCollection.InsertOneAsync(user);
                _logger.LogInformation("User registered successfully: {Username}", user.Username);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering user: {Username}", user.Username);
                throw;
            }
        }
        
        public bool UsernameTaken(string username)
        {
            try
            {
                var taken = _userCollection.Find(user => user.Username == username).Any();
                _logger.LogDebug("Username availability check for {Username}: {Taken}", username, taken);
                return taken;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking username availability for: {Username}", username);
                throw;
            }
        }
        
        public bool IsPasswordUnchanged(byte[] oldHash, byte[] newHash) => oldHash.SequenceEqual(newHash);
    }
}

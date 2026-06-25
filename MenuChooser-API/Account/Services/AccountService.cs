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
            var exists = _userCollection.Find(user => user.Email == email).Any();
            _logger.LogDebug("Account existence check for email {Email}: {Exists}", email, exists);
            return exists;
        }
        
        public async Task RegisterUser(User user)
        {
            _logger.LogInformation("Registering user: {Username}", user.Username);
            await _userCollection.InsertOneAsync(user);
            _logger.LogInformation("User registered successfully: {Username}", user.Username);
        }
        
        public bool UsernameTaken(string username)
        {
            var taken = _userCollection.Find(user => user.Username == username).Any();
            _logger.LogDebug("Username availability check for {Username}: {Taken}", username, taken);
            return taken;
        }
        
        public bool IsPasswordUnchanged(byte[] oldHash, byte[] newHash) => oldHash.SequenceEqual(newHash);
    }
}

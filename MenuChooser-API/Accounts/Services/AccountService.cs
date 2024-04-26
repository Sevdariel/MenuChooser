using MenuChooser.Data;
using MenuChooser.Entities;
using MongoDB.Driver;

namespace MenuChooser.Accounts.Services
{
    public class AccountService
    {
        private readonly IMongoCollection<User> _userCollection;

        public AccountService(DatabaseContext databaseContext)
        {
            _userCollection = databaseContext.GetMongoDatabase().GetCollection<User>("User");
        }

        public bool IsUserExists(string username) => _userCollection.Find(user => user.Username == username).Any();

        public async Task RegisterUser(User user) => await _userCollection.InsertOneAsync(user);
    }
}

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

        public bool AccountExist(string email) => _userCollection.Find(user => user.Email == email).Any();

        public async Task RegisterUser(User user) => await _userCollection.InsertOneAsync(user);

        public bool UsernameTaken(string username) => _userCollection.Find(user => user.Username == username).Any();
    }
}

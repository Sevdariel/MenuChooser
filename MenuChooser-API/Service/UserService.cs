using MenuChooser.Data;
using MenuChooser.Entities;
using MongoDB.Driver;

namespace MenuChooser.Repository
{
    public class UserService
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserService(DatabaseContext databaseInitializer)
        {
            _userCollection = databaseInitializer.GetMongoDatabase().GetCollection<User>(DatabaseExtensions.CollectionName(GetType().Name));
        }

        public async Task<List<User>> GetAsync() => await _userCollection.Find(_ => true).ToListAsync();

        public async Task<User?> GetAsync(string id) => await _userCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(User newUser) => await _userCollection.InsertOneAsync(newUser);

        public async Task UpdateAsync(string id, User updatedUser) => await _userCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);

        public async Task RemoveAsync(string id) => await _userCollection.DeleteOneAsync(x => x.Id == id);
    }
}

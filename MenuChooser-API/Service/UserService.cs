using MenuChooser.Data;
using MenuChooser.Entities;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace MenuChooser.Repository
{
    public class UserService
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserService(IOptions<MenuChooserDatabaseSettings> menuChooserDatabaseSettings)
        {
            var mongoClient = new MongoClient(menuChooserDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(menuChooserDatabaseSettings.Value.DatabaseName);

            _userCollection = mongoDatabase.GetCollection<User>(menuChooserDatabaseSettings.Value.MenuCollectionName);
        }

        public async Task<List<User>> GetAsync() => await _userCollection.Find(_ => true).ToListAsync();

        public async Task<User?> GetAsync(string id) => await _userCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

        public async Task CreateAsync(User newUser) => await _userCollection.InsertOneAsync(newUser);
        
        public async Task UpdateAsync(string id, User updatedUser) => await _userCollection.ReplaceOneAsync(x => x.Id == id, updatedUser);

        public async Task RemoveAsync(string id) => await _userCollection.DeleteOneAsync(x => x.Id == id);
    }
}

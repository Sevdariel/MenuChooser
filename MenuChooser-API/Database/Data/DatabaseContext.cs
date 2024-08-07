using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Database.Data
{
    public class DatabaseContext
    {
        public DatabaseContext(IOptions<DatabaseSettings> databaseSettings)
        {
            _databaseSettings = databaseSettings;
        }

        public void DatabaseInitialization()
        {
            _mongoClient = new MongoClient(_databaseSettings.Value.ConnectionString);

            CreateDatabase();
            CreateCollections();
        }

        public IMongoDatabase GetMongoDatabase()
        {
            return _mongoDatabase;
        }


        private void CreateDatabase()
        {
            _mongoDatabase = _mongoClient.GetDatabase(_databaseSettings.Value.DatabaseName);
        }

        private void CreateCollections()
        {
            var createdCollectionNames = _mongoDatabase.ListCollectionNames().ToList();
            var databaseSettingsCollectionNames = _databaseSettings.Value.CollectionsNames;

            foreach (var databaseSettingsCollectionName in databaseSettingsCollectionNames)
            {
                if (createdCollectionNames.Contains(databaseSettingsCollectionName))
                    continue;

                _mongoDatabase.CreateCollection(databaseSettingsCollectionName);
            }
        }

        private IMongoDatabase _mongoDatabase = null!;
        private MongoClient _mongoClient = null!;
        private IOptions<DatabaseSettings> _databaseSettings;
    }
}

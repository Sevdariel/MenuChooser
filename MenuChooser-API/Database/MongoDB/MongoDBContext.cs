using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Database.Data
{
    public class MongoDBContext
    {
        private readonly ILogger<MongoDBContext> _logger;

        public MongoDBContext(IOptions<MongoDBSettings> databaseSettings, ILogger<MongoDBContext> logger)
        {
            _databaseSettings = databaseSettings;
            _logger = logger;
        }

        public void DatabaseInitialization()
        {
            _logger.LogInformation("Initializing MongoDB connection");
            _mongoClient = new MongoClient(_databaseSettings.Value.ConnectionString);
            _logger.LogInformation("MongoDB client created successfully");

            CreateDatabase();
            CreateCollections();
            _logger.LogInformation("MongoDB initialization completed");
        }

        public IMongoDatabase GetMongoDatabase()
        {
            return _mongoDatabase;
        }

        private void CreateDatabase()
        {
            _logger.LogInformation("Creating database: {DatabaseName}", _databaseSettings.Value.DatabaseName);
            _mongoDatabase = _mongoClient.GetDatabase(_databaseSettings.Value.DatabaseName);
            _logger.LogInformation("Database created successfully: {DatabaseName}", _databaseSettings.Value.DatabaseName);
        }

        private void CreateCollections()
        {
            _logger.LogInformation("Creating collections");
            var createdCollectionNames = _mongoDatabase.ListCollectionNames().ToList();
            var databaseSettingsCollectionNames = _databaseSettings.Value.CollectionsNames;

            foreach (var databaseSettingsCollectionName in databaseSettingsCollectionNames)
            {
                if (createdCollectionNames.Contains(databaseSettingsCollectionName))
                {
                    _logger.LogDebug("Collection already exists: {CollectionName}", databaseSettingsCollectionName);
                    continue;
                }

                _mongoDatabase.CreateCollection(databaseSettingsCollectionName);
                _logger.LogInformation("Collection created: {CollectionName}", databaseSettingsCollectionName);
            }
            _logger.LogInformation("Collections creation completed");
        }

        private IMongoDatabase _mongoDatabase = null!;
        private MongoClient _mongoClient = null!;
        private IOptions<MongoDBSettings> _databaseSettings;
    }
}

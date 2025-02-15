namespace Database.Data
{
    public class MongoDBSettings
    {
        public string ConnectionString { get; set; } = null!;
        public string DatabaseName { get; set; } = null!;
        public string[] CollectionsNames { get; set; } = null!;
    }
}

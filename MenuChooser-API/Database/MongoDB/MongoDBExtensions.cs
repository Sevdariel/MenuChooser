namespace Database.Data
{
    public static class MongoDBExtensions
    {
        public static string CollectionName(string serviceName)
        {
            return serviceName.Replace("Service", "");
        }
    }
}

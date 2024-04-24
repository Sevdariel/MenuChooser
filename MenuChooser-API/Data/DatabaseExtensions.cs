namespace MenuChooser.Data
{
    public static class DatabaseExtensions
    {
        public static string CollectionName(string serviceName)
        {
            return serviceName.Replace("Service", "");
        }
    }
}

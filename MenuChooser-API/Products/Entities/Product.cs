using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Products.Entities
{
    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("producent")]
        public string Producent { get; set; } = null!;
        [BsonElement("createdBy")]
        public string CreatedBy { get; set; } = null!;
        [BsonElement("updatedBy")]
        public string UpdatedBy { get; set; } = null!;
    }
}
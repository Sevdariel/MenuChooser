using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Products.Entities
{
    public enum ProductCategory
    {
        Vegetables,
        Meat,
        Dairy,
        Grains,
        Other
    }

    public class Product
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("producent")]
        public string Producent { get; set; } = null!;

        [BsonElement("sub")]
        public string? Sub { get; set; }

        [BsonElement("emoji")]
        public string? Emoji { get; set; }

        [BsonElement("category")]
        public ProductCategory? Category { get; set; }

        [BsonElement("unit")]
        public string? Unit { get; set; }

        [BsonElement("kcal")]
        public int? Kcal { get; set; }

        [BsonElement("protein")]
        public double? Protein { get; set; }

        [BsonElement("carbs")]
        public double? Carbs { get; set; }

        [BsonElement("fat")]
        public double? Fat { get; set; }

        [BsonElement("createdBy")]
        public string CreatedBy { get; set; } = null!;
        [BsonElement("updatedBy")]
        public string UpdatedBy { get; set; } = null!;
    }
}
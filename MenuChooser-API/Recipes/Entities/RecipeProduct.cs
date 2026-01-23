using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Recipes.Entities
{
    public class RecipeProduct
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } = null!;

        [BsonElement("product")] public string ProductIds { get; set; } = null!;
        [BsonElement("quantity")] public decimal Quantity { get; set; }
        [BsonElement("unit")] public Unit Unit { get; set; }
    }
}
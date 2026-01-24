using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Recipes.Entities
{
    public class RecipeProduct
    {
        [BsonElement("productId")] public string? ProductId { get; set; } = null!;
        [BsonElement("quantity")] public decimal Quantity { get; set; }
        [BsonElement("unit")] public Unit Unit { get; set; }
    }
}
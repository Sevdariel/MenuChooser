using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using Products.Entities;

namespace Recipes.Entities
{
    public class Recipe
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = null!;

        [BsonElement("duration")]
        public int Duration { get; set; }

        [BsonElement("products")]
        public List<Product> Products { get; set; } = null!;

        [BsonElement("mealType")]
        public MealType MealType { get; set; }

        [BsonElement("steps")]
        public List<Step> Steps { get; set; } = null!;
    }
}

using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

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

        [BsonElement("productsId")]
        public List<string> ProductsId { get; set; } = null!;

        [BsonElement("mealType")]
        public MealType? MealType { get; set; }

        [BsonElement("steps")]
        public List<Step> Steps { get; set; } = null!;

        [BsonElement("createdBy")]
        public string CreatedBy { get; set; } = null!;

        [BsonElement("updatedBy")]
        public string UpdatedBy { get; set; } = null!;
    }
}

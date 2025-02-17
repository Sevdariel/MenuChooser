using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using Products.Entities;

namespace Recipes.Entities
{
    public class Step
    {
        [BsonElement("order")]
        public int Order { get; set; }

        [BsonElement("content")]
        public string Content { get; set; } = null!;

        [BsonElement("products")]
        public List<string>? ProductsId { get; set; }

        [BsonElement("duration")]
        public int Duration { get; set; }

    }
}

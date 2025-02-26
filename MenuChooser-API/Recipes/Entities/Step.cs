using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace Recipes.Entities
{
    public class Step
    {
        [BsonElement("order")]
        public int Order { get; set; }

        [BsonElement("content")]
        public string Content { get; set; } = null!;

        [BsonElement("productsId")]
        public List<string>? ProductIds { get; set; }

        [BsonElement("duration")]
        public int Duration { get; set; }

    }
}

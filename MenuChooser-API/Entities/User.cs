using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace MenuChooser.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public int Id { get; set; }
        [BsonElement("Name")]
        public string Username { get; set; } = null!;
        public byte[] PasswordHash { get; set; } = null!;
        public byte[] PasswordSalt { get; set; } = null!;
    }
}

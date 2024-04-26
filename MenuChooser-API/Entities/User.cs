using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Text.Json.Serialization;

namespace MenuChooser.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("username")]
        [JsonPropertyName("username")]
        public string Username { get; set; } = null!;
        [BsonElement("passwordHash")]
        public byte[] PasswordHash { get; set; } = null!;
        [BsonElement("passwordSalt")]
        public byte[] PasswordSalt { get; set; } = null!;
    }
}

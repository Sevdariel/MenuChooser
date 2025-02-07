using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Users.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("email")]
        public string Email { get; set; } = null!;

        [BsonElement("username")]
        public string Username { get; set; } = null!;

        [BsonElement("passwordHash")]
        public byte[] PasswordHash { get; set; } = null!;

        [BsonElement("passwordSalt")]
        public byte[] PasswordSalt { get; set; } = null!;

        [BsonElement("termsOfUse")]
        public bool TermsOfUse { get; set; } = false;

        [BsonElement("privacyPolicy")]
        public bool PrivacyPolicy { get; set; } = false;
    }
}

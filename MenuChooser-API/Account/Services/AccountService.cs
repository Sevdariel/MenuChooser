﻿using Database.Data;
using MongoDB.Driver;
using Users.Entities;

namespace Account.Services
{
    public class AccountService : IAccountService
    {
        private readonly IMongoCollection<User> _userCollection;

        public AccountService(MongoDBContext databaseContext)
        {
            _userCollection = databaseContext.GetMongoDatabase().GetCollection<User>("User");
        }

        public bool AccountExist(string email) => _userCollection.Find(user => user.Email == email).Any();
        public async Task RegisterUser(User user) => await _userCollection.InsertOneAsync(user);
        public bool UsernameTaken(string username) => _userCollection.Find(user => user.Username == username).Any();
        public bool IsPasswordUnchanged(byte[] oldHash, byte[] newHash) => oldHash.SequenceEqual(newHash);
    }
}

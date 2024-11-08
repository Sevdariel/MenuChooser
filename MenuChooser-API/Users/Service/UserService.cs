﻿using Database.Data;
using MongoDB.Driver;
using Users.Entities;

namespace Users.Service
{
    public class UserService
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserService(DatabaseContext databaseInitializer)
        {
            _userCollection = databaseInitializer.GetMongoDatabase().GetCollection<User>(DatabaseExtensions.CollectionName(GetType().Name));
        }

        public async Task<List<User>> GetUsersAsync() => await _userCollection.Find(_ => true).ToListAsync();

        public async Task<User?> GetUserByEmailAsync(string email) => await _userCollection.Find(x => x.Email == email).FirstOrDefaultAsync();

        public User GetUserByEmail(string email) => _userCollection.Find(email).FirstOrDefault();

        public async Task CreateUserAsync(User newUser) => await _userCollection.InsertOneAsync(newUser);

        public async Task UpdateUserAsync(string email, User updatedUser) => await _userCollection.ReplaceOneAsync(x => x.Email == email, updatedUser);

        public async Task RemoveUserAsync(string email) => await _userCollection.DeleteOneAsync(x => x.Email == email);
    }
}

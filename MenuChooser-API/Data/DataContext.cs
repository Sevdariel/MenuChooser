using MenuChooser.Entities;
using Microsoft.EntityFrameworkCore;

namespace MenuChooser.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {            
        }

        public DbSet<User> Users { get; set; }
    }
}

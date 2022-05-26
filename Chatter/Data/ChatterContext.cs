using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data
{
    public class ChatterContext : DbContext
    {
        public DbSet<ChatRoom> ChatRooms { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Message> Messages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Database=Chatter;Username=postgres;Password=postgres;Include Error Detail=true");
        }
    }
}

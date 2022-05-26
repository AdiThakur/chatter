using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data
{
    public class ChatRoomContext : DbContext
    {
        public DbSet<ChatRoom> ChatRooms { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Message> Messages { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost;Database=ChatRoom;Username=postgres;Password=postgres");
        }
    }
}

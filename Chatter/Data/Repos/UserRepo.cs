using Chatter.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public interface IUsersRepo
    {
        Task<User?> AddUserAsync(User user);
        Task<List<User>> GetUsersAsync();
        Task<User?> GetUserAsync(long? userId);
        Task<User?> GetUserAsync(string? displayName);
        Task<User?> GetUserWithChatRoomsAsync(long userId);
    }

    public class UserRepo : BaseRepo, IUsersRepo
    {
        public UserRepo(ChatterContext context) : base(context) { }

        public async Task<User?> AddUserAsync(User user)
        {
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
            return await context.Users.FindAsync(user.Id);
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await context.Users.ToListAsync();
        }

        public async Task<User?> GetUserAsync(long? userId)
        {
            if (userId == null)
            {
                return null;
            }

            return await context.Users
               .Where(u => u.Id == userId)
               .FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserAsync(string? displayName)
        {
            if (displayName == null)
            {
                return null;
            }

            return await context.Users
               .Where(u => u.Username == displayName)
               .FirstOrDefaultAsync();
        }

        public async Task<User?> GetUserWithChatRoomsAsync(long userId)
        {
            return await context.Users
                .Where(u => u.Id == userId)
                .Include(u => u.ChatRooms)
                .FirstOrDefaultAsync();
        }
    }
}

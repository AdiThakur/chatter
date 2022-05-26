using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public class UsersRepo : BaseRepo
    {
        public UsersRepo(ChatterContext context) : base(context) {}

        public async Task AddUserAsync(User user)
        {
            await context.Users.AddAsync(user);
            await context.SaveChangesAsync();
        }

        public async Task<User?> GetUserWithChatRoomsAsync(long userId)
        {
            return await context.Users
                .Where(u => u.Id == userId)
                .Include(u => u.ChatRooms)
                .FirstAsync<User>();
        }
    }
}

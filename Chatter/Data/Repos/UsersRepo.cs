using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public class UsersRepo
    {
        private readonly ChatRoomContext _context;

        public UsersRepo(ChatRoomContext context)
        {
            _context = context;
        }

        public async Task AddUser(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public Task<User> GetUserWithChatRooms(User user)
        {
            return _context.Users
                .Where(u => u.Id == user.Id)
                .Include(u => u.ChatRooms)
                .FirstAsync<User>();
        }
    }
}

using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public class ChatRoomsRepo : BaseRepo
    {
        public ChatRoomsRepo(ChatterContext context) : base(context) {}

        public async Task AddChatRoomAsync(ChatRoom chatRoom)
        {
            await context.ChatRooms.AddAsync(chatRoom);
            await context.SaveChangesAsync();
        }

        public async Task<List<ChatRoom>> GetChatRoomsAsync()
        {
            return await context.ChatRooms.ToListAsync();
        }

        public async Task<ChatRoom?> GetChatRoomAsync(string chatRoomId)
        {
            return await context.ChatRooms
                .Where(chatRoom => chatRoom.Id == chatRoomId)
                .FirstOrDefaultAsync();
        }

        public async Task<ChatRoom?> GetChatRoomWithUsersAndMessagesAsync(string chatRoomId)
        {
            return await context.ChatRooms
                .Where(chatRoom => chatRoom.Id == chatRoomId)
                .Include(chatRoom => chatRoom.Messages)
                .Include(chatRoom => chatRoom.Users)
                .FirstOrDefaultAsync();
        }
    }
}

using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public class ChatRoomRepo : BaseRepo
    {
        public ChatRoomRepo(ChatterContext context) : base(context) {}

        public async Task AddChatRoomAsync(ChatRoom chatRoom)
        {
            await context.ChatRooms.AddAsync(chatRoom);
            await context.SaveChangesAsync();
        }

        public Task<ChatRoom> GetChatRoomWithUsersAndMessagesAsync(long chatRoomId)
        {
            return context.ChatRooms
                .Where(chatRoom => chatRoom.Id == chatRoomId)
                .Include(chatRoom => chatRoom.Messages)
                .Include(chatRoom => chatRoom.Users)
                .FirstAsync();
        }
    }
}

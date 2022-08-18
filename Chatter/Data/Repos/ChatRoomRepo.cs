using Chatter.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public interface IChatRoomsRepo
    {
        Task AddChatRoomAsync(ChatRoom chatRoom);
        Task AddUserToChatRoom(ChatRoom chatRoom, User user);
        Task RemoveUserFromChatRoom(ChatRoom chatRoom, User user);
        Task<List<ChatRoom>> GetChatRoomsAsync();
        Task<ChatRoom?> GetChatRoomAsync(string? chatRoomId);
    }

    public class ChatRoomRepo : BaseRepo, IChatRoomsRepo
    {
        private readonly IUserRepo _userRepo;

        public ChatRoomRepo(
            ChatterContext context,
            IUserRepo userRepo
        ) : base(context)
        {
            _userRepo = userRepo;
        }

        public async Task AddChatRoomAsync(ChatRoom chatRoom)
        {
            await context.ChatRooms.AddAsync(chatRoom);
            await context.SaveChangesAsync();
        }

        public async Task AddUserToChatRoom(ChatRoom chatRoom, User user)
        {
            chatRoom.Users.Add(user);
            await context.SaveChangesAsync();
        }

        public async Task RemoveUserFromChatRoom(ChatRoom chatRoom, User user)
        {
            chatRoom.Users.Remove(user);
            await context.SaveChangesAsync();
        }

        public async Task<List<ChatRoom>> GetChatRoomsAsync()
        {
            return await context.ChatRooms
                .Include(chatRoom => chatRoom.Users)
                .ToListAsync();
        }

        public async Task<ChatRoom?> GetChatRoomAsync(string? chatRoomId)
        {
            if (chatRoomId == null)
            {
                return null;
            }

            return await context.ChatRooms
                .Where(chatRoom => chatRoom.Id == chatRoomId)
                .Include(chatRoom => chatRoom.Users)
                .FirstOrDefaultAsync();
        }
    }
}

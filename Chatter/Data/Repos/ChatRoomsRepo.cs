using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public interface IChatRoomsRepo
    {
        Task AddChatRoomAsync(ChatRoom chatRoom);
        Task AddUserToChatRoom(string chatRoomId, long userToAddId);
        Task<ChatRoom?> GetChatRoomAsync(string chatRoomId);
        Task<List<ChatRoom>> GetChatRoomsAsync();
        Task<ChatRoom?> GetChatRoomWithUsersAndMessagesAsync(string chatRoomId);
        Task<ChatRoom?> GetChatRoomWithUsersAsync(string chatRoomId);
    }

    public class ChatRoomsRepo : BaseRepo, IChatRoomsRepo
    {
        private readonly IUsersRepo _usersRepo;

        public ChatRoomsRepo(
            ChatterContext context,
            IUsersRepo usersRepo
        ) : base(context)
        {
            _usersRepo = usersRepo;
        }

        public async Task AddChatRoomAsync(ChatRoom chatRoom)
        {
            await context.ChatRooms.AddAsync(chatRoom);
            await context.SaveChangesAsync();
        }

        public async Task AddUserToChatRoom(string chatRoomId, long userToAddId)
        {
            var chatRoom = await GetChatRoomWithUsersAsync(chatRoomId);
            if (chatRoom == null)
            {
                throw new ArgumentException($"ChatRoom {chatRoomId} does not exist");
            }

            var userToAdd = await _usersRepo.GetUserAsync(userToAddId);
            if (userToAdd == null)
            {
                throw new ArgumentException($"ChatRoom {userToAddId} does not exist");
            }

            chatRoom.Users ??= new List<User>();
            chatRoom.Users.Add(userToAdd);

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

        public async Task<ChatRoom?> GetChatRoomWithUsersAsync(string chatRoomId)
        {
            return await context.ChatRooms
                .Where(chatRoom => chatRoom.Id == chatRoomId)
                .Include(chatRoom => chatRoom.Users)
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

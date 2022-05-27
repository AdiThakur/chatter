using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public class ChatRoomsRepo : BaseRepo
    {
        private readonly UsersRepo _usersRepo;

        public ChatRoomsRepo(
            ChatterContext context,
            UsersRepo usersRepo
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

            var userToAdd = await _usersRepo.GetUser(userToAddId);
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

using Chatter.Data.Entities;
using Chatter.Data.Repos;

namespace Chatter.Services
{
    public interface IChatRoomService
    {
        Task AddUserToChatRoomAsync(string? chatRoomId, long? userId);
        Task CreateChatRoomAsync(string chatRoomId, string chatRoomDesc);
        Task<ChatRoom?> GetChatRoomAsync(string? chatRoomId);
        Task<List<ChatRoom>> GetChatRoomsAsync();
    }

    public class ChatRoomService : IChatRoomService
    {
        private readonly IChatRoomsRepo _chatRoomsRepo;
        private readonly IUsersRepo _usersRepo;

        public ChatRoomService(
            IChatRoomsRepo chatRoomsRepo,
            IUsersRepo usersRepo
        )
        {
            _chatRoomsRepo = chatRoomsRepo;
            _usersRepo = usersRepo;
        }

        public async Task CreateChatRoomAsync(string chatRoomId, string chatRoomDesc)
        {
            if (await _chatRoomsRepo.GetChatRoomAsync(chatRoomId) != null)
            {
                throw new UserException(
                    "Invalid ChatRoom Id",
                    "Id must be unique"
                );
            }

            await _chatRoomsRepo.AddChatRoomAsync(
                new ChatRoom
                {
                    Id = chatRoomId,
                    Description = chatRoomDesc
                }
            );
        }

        public async Task AddUserToChatRoomAsync(string? chatRoomId, long? userId)
        {
            // Validate ChatRoom
            var chatRoom = await _chatRoomsRepo.GetChatRoomAsync(chatRoomId);
            if (chatRoom == null)
            {
                throw new UserException(
                    "Invalid ChatRoom Id",
                    "ChatRoom was not found"
                );
            }

            // Validate User
            var user = await _usersRepo.GetUserAsync(userId);
            if (user == null)
            {
                throw new UserException(
                     "Invalid Username",
                     "User does not exist"
                 );
            }

            if (chatRoom.Users.Any(userInChatRoom => userInChatRoom.Id == user.Id))
            {
                throw new UserException("User is already in ChatRoom");
            }

            await _chatRoomsRepo.AddUserToChatRoom(chatRoom, user);
        }

        public async Task<List<ChatRoom>> GetChatRoomsAsync()
        {
            return await _chatRoomsRepo.GetChatRoomsAsync();
        }

        public async Task<ChatRoom?> GetChatRoomAsync(string? chatRoomId)
        {
            return await _chatRoomsRepo.GetChatRoomAsync(chatRoomId);
        }
    }
}

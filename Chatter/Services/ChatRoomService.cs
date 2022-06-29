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
        Task<List<Message>> GetLatestMessagesForChatRoomAsync(string chatRoomId, int count);
    }

    public class ChatRoomService : IChatRoomService
    {
        private readonly IChatRoomsRepo _chatRoomsRepo;
        private readonly IUserRepo _userRepo;
        private readonly IMessageRepo _messagesRepo;

        public ChatRoomService(
            IChatRoomsRepo chatRoomsRepo,
            IUserRepo userRepo,
            IMessageRepo messageRepo
        )
        {
            _chatRoomsRepo = chatRoomsRepo;
            _userRepo = userRepo;
            _messagesRepo = messageRepo;
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
            var user = await _userRepo.GetUserAsync(userId);
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

        public async Task<List<Message>> GetLatestMessagesForChatRoomAsync(string chatRoomId, int count)
        {
            return await _messagesRepo.GetLatestMessagesForChatRoomAsync(chatRoomId, count);
        }
    }
}

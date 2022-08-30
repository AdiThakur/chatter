using Chatter.Data.Entities;
using Chatter.Data.Repos;

namespace Chatter.Services
{
    public interface IChatRoomService
    {
        Task AddUserAsync(string? chatRoomId, long? userId);
        Task RemoveUserAsync(string chatRoomId, long userId);
        Task CreateChatRoomAsync(string chatRoomId, string chatRoomDesc);
        Task<ChatRoom?> GetChatRoomAsync(string? chatRoomId);
        Task<List<ChatRoom>> GetChatRoomsAsync(string? nameToMatch);
        Task<List<Message>> GetMessagesAsync(string chatRoomId, int offset, int count);
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

        public async Task AddUserAsync(string? chatRoomId, long? userId)
        {
            var user = await ValidateUserAsync(userId);
            var chatRoom = await ValidateChatRoomAsync(chatRoomId);

            if (chatRoom.Users.Any(userInChatRoom => userInChatRoom.Id == user.Id))
            {
                throw new UserException("User is already in ChatRoom");
            }

            await _chatRoomsRepo.AddUserToChatRoom(chatRoom, user);
        }

        public async Task RemoveUserAsync(string chatRoomId, long userId)
        {
            var user = await ValidateUserAsync(userId);
            var chatRoom = await ValidateChatRoomAsync(chatRoomId);

            if (chatRoom.Users.All(userInChatRoom => userInChatRoom.Id != user.Id))
            {
                throw new UserException("User is not in ChatRoom");
            }

            await _chatRoomsRepo.RemoveUserFromChatRoom(chatRoom, user);
        }

        private async Task<ChatRoom> ValidateChatRoomAsync(string? chatRoomId)
        {
            var chatRoom = await _chatRoomsRepo.GetChatRoomAsync(chatRoomId);
            if (chatRoom == null)
            {
                throw new UserException(
                    "Invalid ChatRoom Id",
                    "ChatRoom was not found"
                );
            }

            return chatRoom;
        }

        private async Task<User> ValidateUserAsync(long? userId)
        {
            var user = await _userRepo.GetUserAsync(userId);
            if (user == null)
            {
                throw new UserException(
                    "Invalid Username",
                    "User does not exist"
                );
            }

            return user;
        }

        public async Task<ChatRoom?> GetChatRoomAsync(string? chatRoomId)
        {
            var chatRoom = await _chatRoomsRepo.GetChatRoomAsync(chatRoomId);
            if (chatRoom == null)
            {
                return null;
            }

            var latestMessage = await GetMessagesAsync(chatRoom.Id, 0, 1);
            chatRoom.Messages = new List<Message>(latestMessage);

            return chatRoom;
        }

        public async Task<List<ChatRoom>> GetChatRoomsAsync(string? nameToMatch)
        {
            var allChatRooms = await _chatRoomsRepo.GetChatRoomsAsync();

            if (string.IsNullOrEmpty(nameToMatch))
            {
                return allChatRooms;
            }

            nameToMatch = nameToMatch.ToLower();

            return allChatRooms
                .Where(chatRoom => chatRoom.Id.ToLower().Contains(nameToMatch))
                .ToList();
        }

        public async Task<List<Message>> GetMessagesAsync(string chatRoomId, int offset, int count)
        {
            return await _messagesRepo.GetLatestMessagesForChatRoomAsync(chatRoomId, offset, count);
        }
    }
}

using Chatter.Data;
using Chatter.Data.Entities;
using Chatter.Data.Models;
using Chatter.Data.Repos;

namespace Chatter.Services;

public interface IMessageService
{
    MessageModel SanitizeMessage(User caller, MessageModel message);
    Task<MessageModel?> AddMessageAsync(long userId, MessageModel messageModel);
}

public class MessageService : IMessageService
{
    private readonly IMessageRepo _messageRepo;
    private readonly IUserService _userService;
    private readonly IChatRoomService _chatRoomService;

    public MessageService(
        IMessageRepo messageRepo,
        IUserService userService,
        IChatRoomService chatRoomService
    )
    {
        _messageRepo = messageRepo;
        _userService = userService;
        _chatRoomService = chatRoomService;
    }

    public MessageModel SanitizeMessage(User caller, MessageModel message)
    {
        message.AuthorName = caller.Username;
        message.AuthorAvatarUri = caller.AvatarUri;
        message.TimeStamp = DateTime.Now;

        return message;
    }

    public async Task<MessageModel?> AddMessageAsync(long userId, MessageModel messageModel)
    {
        var user = await _userService.GetUserAsync(userId);
        if (user == null)
        {
            return null;
        }

        var isInChatRoom = user.ChatRooms
            .Select(chatRoom => chatRoom.Id)
            .Contains(messageModel.ChatRoomId);
        if (!isInChatRoom)
        {
            return null;
        }

        var chatRoom = await _chatRoomService.GetChatRoomAsync(messageModel.ChatRoomId);
        if (chatRoom == null)
        {
            return null;
        }

        var messageEntity = new Message
        {
            Author = user,
            ChatRoom = chatRoom,
            TimeStamp = DateTime.UtcNow,
            Content = messageModel.Content
        };

        await _messageRepo.AddMessageAsync(messageEntity);

        return messageEntity.ToModel();
    }
}
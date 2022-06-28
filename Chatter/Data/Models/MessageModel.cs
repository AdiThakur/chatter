using Chatter.Data.Entities;

namespace Chatter.Data.Models;

public class MessageModel
{
    public long Id { get; set; }

    public DateTime TimeStamp { get; set; }

    public string Content { get; set; } = string.Empty;

    public string ChatRoomId { get; set; }

    public string AuthorName { get; set; }

    public string AuthorAvatarUri { get; set; }

    public MessageModel(Message messageEntity)
    {
        Id = messageEntity.Id;
        TimeStamp = messageEntity.TimeStamp;
        Content = messageEntity.Content;
        ChatRoomId = messageEntity.ChatRoom.Id;
        AuthorName = messageEntity.Author.Username;
        AuthorAvatarUri = messageEntity.Author.AvatarUri;
    }
}
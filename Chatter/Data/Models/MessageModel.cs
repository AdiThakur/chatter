using System.Text.Json.Serialization;
using Chatter.Data.Entities;

namespace Chatter.Data.Models;

public class MessageModel
{
    public DateTime TimeStamp { get; set; }

    public string Content { get; set; }

    public string ChatRoomId { get; set; }

    public string AuthorName { get; set; }

    public string AuthorAvatarUri { get; set; }

    [JsonConstructor]
    public MessageModel(
        DateTime timeStamp,
        string chatRoomId,
        string authorName,
        string authorAvatarUri,
        string content = ""
    )
    {
        TimeStamp = timeStamp;
        ChatRoomId = chatRoomId;
        AuthorName = authorName;
        AuthorAvatarUri = authorAvatarUri;
        Content = content;
    }

    public MessageModel(Message messageEntity)
    {
        TimeStamp = messageEntity.TimeStamp;
        Content = messageEntity.Content;
        ChatRoomId = messageEntity.ChatRoom.Id;
        AuthorName = messageEntity.Author.Username;
        AuthorAvatarUri = messageEntity.Author.AvatarUri;
    }
}
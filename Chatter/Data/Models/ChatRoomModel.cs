using Chatter.Data.Entities;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Chatter.Data.Models
{
    public class ChatRoomModel
    {
        [MinLength(6)]
        [MaxLength(6)]
        public string Id { get; set; }

        [MinLength(6)]
        [MaxLength(300)]
        public string Description { get; set; }

        public ICollection<string>? Users { get; set; }

        public MessageModel? LatestMessage { get; set; }

        [JsonConstructor]
        public ChatRoomModel(
            string id,
            string description,
            MessageModel? latestMessage,
            ICollection<string>? users
        )
        {
            Id = id;
            Description = description;
            Users = users;
            LatestMessage = latestMessage;
        }

        public ChatRoomModel(ChatRoom chatRoomEntity)
        {
            Id = chatRoomEntity.Id;
            Description = chatRoomEntity.Description;
            LatestMessage = chatRoomEntity.Messages.FirstOrDefault().ToModel();
            Users = chatRoomEntity.Users
                .Select(userEntity => userEntity.Username)
                .ToList();
        }
    }
}

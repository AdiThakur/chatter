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

        public ICollection<UserModel>? Users { get; set; }

        [JsonConstructor]
        public ChatRoomModel(
            string id,
            string description,
            ICollection<UserModel>? users
        )
        {
            Id = id;
            Description = description;
            Users = users;
        }

        public ChatRoomModel(ChatRoom chatRoomEntity)
        {
            Id = chatRoomEntity.Id;
            Description = chatRoomEntity.Description;
            Users = chatRoomEntity.Users
                .Select(userEntity => new UserModel(userEntity))
                .ToList();
        }
    }
}

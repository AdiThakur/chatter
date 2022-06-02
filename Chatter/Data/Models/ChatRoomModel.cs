using System.Text.Json.Serialization;

namespace Chatter.Data.Models
{
    public class ChatRoomModel
    {
        public string? Id { get; set; }

        public string? Description { get; set; } = string.Empty;

        public ICollection<UserModel>? Users { get; set; }

        [JsonConstructor]
        public ChatRoomModel() { }

        public ChatRoomModel(ChatRoom chatRoomEntity)
        {
            Id = chatRoomEntity.Id;
            Description = chatRoomEntity.Description;
            Users = chatRoomEntity.Users.Select(userEntity => new UserModel(userEntity)).ToList();
        }
    }
}

using Chatter.Data.Entities;
using System.Text.Json.Serialization;

namespace Chatter.Data.Models
{
    public class UserModel
    {
        public long Id { get; set; }

        public string Username { get; set; }

        public ICollection<string>? ChatRooms { get; set; }

        [JsonConstructor]
        public UserModel(
            long id,
            string username,
            ICollection<string>? chatRooms
        )
        {
            Id = id;
            Username = username;
            ChatRooms = chatRooms;
        }

        public UserModel(User userEntity)
        {
            Id = userEntity.Id;
            Username = userEntity.Username;
            ChatRooms = userEntity.ChatRooms
                .Select(chatRoomEntity => chatRoomEntity.Id)
                .ToList();
        }
    }
}

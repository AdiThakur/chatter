using Chatter.Data.Entities;
using System.Text.Json.Serialization;

namespace Chatter.Data.Models
{
    public class UserModel
    {
        public long Id { get; set; }

        public string Username { get; set; }

        public string AvatarUri { get; set; }

        public ICollection<string>? ChatRooms { get; set; }

        [JsonConstructor]
        public UserModel(
            long id,
            string username,
            string avatarUri,
            ICollection<string>? chatRooms
        )
        {
            Id = id;
            Username = username;
            AvatarUri = avatarUri;
            ChatRooms = chatRooms;
        }

        public UserModel(User userEntity)
        {
            Id = userEntity.Id;
            Username = userEntity.Username;
            AvatarUri = userEntity.AvatarUri;
            ChatRooms = userEntity.ChatRooms
                .Select(chatRoomEntity => chatRoomEntity.Id)
                .ToList();
        }
    }
}

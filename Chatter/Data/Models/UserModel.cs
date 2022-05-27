namespace Chatter.Data.Models
{
    public class UserModel
    {
        public long Id { get; set; }

        public string DisplayName { get; set; }

        public ICollection<string> ChatRooms { get; set; }

        public UserModel(User userEntity)
        {
            Id = userEntity.Id;
            DisplayName = userEntity.DisplayName;
            ChatRooms = userEntity.ChatRooms.Select(chatRoomEntity => chatRoomEntity.Id).ToList();
        }
    }
}

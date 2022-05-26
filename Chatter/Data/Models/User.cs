namespace Chatter.Data.Models
{
    public class User
    {
        public long Id { get; set; }

        public string DisplayName { get; set; }

        public ICollection<ChatRoom>? ChatRooms { get; set; }

        public ICollection<Message>? Messages { get; set; }
    }
}

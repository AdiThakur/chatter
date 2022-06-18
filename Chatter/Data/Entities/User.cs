namespace Chatter.Data.Entities
{
    public class User
    {
        public long Id { get; set; }

        public string Username { get; set; }

        public string PasswordHash { get; set; }

        public string AvatarUri { get; set; }

        public ICollection<ChatRoom> ChatRooms { get; set; } = new List<ChatRoom>();

        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}

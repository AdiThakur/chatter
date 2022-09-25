namespace Chatter.Data.Entities
{
    public class User
    {
        public long Id { get; set; }

        public string Username { get; set; }

        public string PasswordHash { get; set; }

        public string AvatarUri { get; set; }

        public List<ChatRoom> ChatRooms { get; set; } = new();

        public List<Message> Messages { get; set; } = new();
    }
}

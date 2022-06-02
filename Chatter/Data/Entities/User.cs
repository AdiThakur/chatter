namespace Chatter.Data.Models
{
    public class User
    {
        public long Id { get; set; }

        public string UserName { get; set; }

        public string Password { get; set; }

        public ICollection<ChatRoom> ChatRooms { get; set; } = new List<ChatRoom>();

        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}

namespace Chatter.Data.Models
{
    public class Message
    {
        public long Id { get; set; }

        public string Content { get; set; } = string.Empty;

        public ChatRoom ChatRoom { get; set; }

        public User Author { get; set; }
    }
}

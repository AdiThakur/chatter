namespace Chatter.Data.Models
{
    public class ChatRoom
    {
        public string Id { get; set; }

        public string Description { get; set; } = string.Empty;

        public ICollection<User>? Users { get; set; }

        public ICollection<Message>? Messages { get; set; }
    }
}

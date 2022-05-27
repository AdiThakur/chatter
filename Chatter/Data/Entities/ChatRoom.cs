namespace Chatter.Data.Models
{
    public class ChatRoom
    {
        public static int IdLength = 6;

        public string Id { get; set; }

        public string Description { get; set; } = string.Empty;

        public ICollection<User> Users { get; set; } = new List<User>();

        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}

namespace Chatter.Data.Entities
{
    public class ChatRoom
    {
        public string Id { get; set; }

        public string Description { get; set; }

        public List<User> Users { get; set; } = new();

        public List<Message> Messages { get; set; } = new();
    }
}

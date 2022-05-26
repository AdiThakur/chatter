namespace Chatter.Data.Models
{
    public class ChatRoom
    {
        public long Id { get; set; }

        public ICollection<User>? Users { get; set; }

        public ICollection<Message>? Messages { get; set; }
    }
}

using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public class MessageRepo : BaseRepo
    {
        public MessageRepo(ChatterContext context) : base(context) {}

        public async Task AddMessageAsync(Message message)
        {
            await context.Messages.AddAsync(message);
            await context.SaveChangesAsync();
        }

        public Task<Message> GetMessageAsync(long messageId)
        {
            return context.Messages
                .Where(message => message.Id == messageId)
                .Include(message => message.ChatRoom)
                .Include(message => message.Author)
                .FirstAsync();
        }
    }
}

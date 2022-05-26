using Chatter.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public class MessagesRepo : BaseRepo
    {
        public MessagesRepo(ChatterContext context) : base(context) {}

        public async Task AddMessageAsync(Message message)
        {
            await context.Messages.AddAsync(message);
            await context.SaveChangesAsync();
        }

        public async Task<Message?> GetMessageAsync(long messageId)
        {
            return await context.Messages
                .Where(message => message.Id == messageId)
                .Include(message => message.ChatRoom)
                .Include(message => message.Author)
                .FirstAsync();
        }
    }
}

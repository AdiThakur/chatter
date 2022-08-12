using Chatter.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chatter.Data.Repos
{
    public interface IMessageRepo
    {
        Task AddMessageAsync(Message message);
        Task<Message?> GetMessageAsync(long messageId);
        Task<List<Message>> GetLatestMessagesForChatRoomAsync(string chatRoomId, int offset, int count);
    }

    public class MessageRepo : BaseRepo, IMessageRepo
    {
        public MessageRepo(ChatterContext context) : base(context) {}

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

        public async Task<List<Message>> GetLatestMessagesForChatRoomAsync(string chatRoomId, int offset, int count)
        {
            return await context.Messages
                .OrderByDescending(message => message.TimeStamp)
                .Where(message => message.ChatRoom.Id == chatRoomId)
                .Include(message => message.Author)
                .Include(message => message.ChatRoom)
                .Skip(offset)
                .Take(count)
                .ToListAsync();
        }
    }
}

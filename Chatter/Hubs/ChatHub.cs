using Chatter.Data.Entities;
using Chatter.Data.Models;
using Chatter.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Chatter.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IUserService _userService;
    private readonly IMessageService _messageService;

    public ChatHub(
        IUserService userService,
        IMessageService messageService
    )
    {
        _userService = userService;
        _messageService = messageService;
    }

    public override async Task OnConnectedAsync()
    {
        var caller = await GetUserAsync();
        await AddUserToGroups(caller);
    }

    public async Task SendMessage(MessageModel message)
    {
        var addedMessage = await _messageService.AddMessageAsync(
            GetUserId(), message
        );

        if (addedMessage != null)
        {
            await Clients.Groups(message.ChatRoomId).SendAsync("ReceiveMessage", message);
        }
    }

    private long GetUserId()
    {
        var userId = Context.User?.Claims
            .FirstOrDefault(claim => claim.Type == "id")?.Value;

        if (userId == null)
        {
            throw new HubException("User not found");
        }

        return long.Parse(userId);
    }

    private async Task<User> GetUserAsync()
    {
        var userId = GetUserId();
        var user = await _userService.GetUserAsync(userId);

        if (user == null)
        {
            throw new HubException("User not found");
        }

        return user;
    }

    private async Task AddUserToGroups(User user)
    {
        foreach (var chatRoom in user.ChatRooms)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom.Id);
        }
    }
}
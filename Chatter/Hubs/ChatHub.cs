using Chatter.Data.Entities;
using Chatter.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Chatter.Hubs;

[Authorize]
public class ChatHub : Hub
{
    private readonly IUserService _userService;

    public ChatHub(IUserService userService)
    {
        _userService = userService;
    }

    public override async Task OnConnectedAsync()
    {
        var caller = await GetUserAsync();
        await AddUserToGroups(caller);
    }

    private async Task<User> GetUserAsync()
    {
        var userId = Context.User?.Claims
            .FirstOrDefault(claim => claim.Type == "id")?.Value;
        if (userId == null)
        {
            throw new HubException("User not found");
        }

        var user = await _userService.GetUserAsync(long.Parse(userId));
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
using Chatter.Data;
using Chatter.Data.Models;
using Chatter.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chatter.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ChatRoomController : ControllerBase
    {
        private readonly IChatRoomService _chatRoomService;

        public ChatRoomController(IChatRoomService chatRoomService)
        {
            _chatRoomService = chatRoomService;
        }

        [HttpPost]
        public async Task<ActionResult> CreateChatRoomAsync(ChatRoomModel chatRoomToAdd)
        {
            await _chatRoomService.CreateChatRoomAsync(
                chatRoomToAdd.Id,
                chatRoomToAdd.Description
            );

            return Ok();
        }

        [HttpPost("{chatRoomId}/user")]
        public async Task<ActionResult> AddUserToChatRoomAsync([FromRoute] string chatRoomId, UserModel userToAdd)
        {
            await _chatRoomService.AddUserToChatRoomAsync(chatRoomId, userToAdd.Id);

            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ChatRoomModel>>> GetChatRooms()
        {
            var chatRooms = await _chatRoomService.GetChatRoomsAsync();

            return Ok(chatRooms.ToModels());
        }

        [HttpGet("{chatRoomId}")]
        public async Task<ActionResult<ChatRoomModel?>> GetChatRoom([FromRoute] string chatRoomId)
        {
            var chatRoom = await _chatRoomService.GetChatRoomAsync(chatRoomId);

            return Ok(chatRoom.ToModel());
        }
    }
}

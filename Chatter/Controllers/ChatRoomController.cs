using Chatter.Data.Models;
using Chatter.Data.Repos;
using Microsoft.AspNetCore.Mvc;

namespace Chatter.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatRoomController : ControllerBase
    {
        private readonly ChatRoomsRepo _chatRoomsRepo;

        public ChatRoomController(
            ChatRoomsRepo chatRoomsRepo
        ) {
            _chatRoomsRepo = chatRoomsRepo;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> CreateChatRoomAsync(ChatRoom chatRoomToAdd)
        {
            if (chatRoomToAdd == null ||
                string.IsNullOrEmpty(chatRoomToAdd.Id) ||
                chatRoomToAdd.Id.Length != ChatRoom.IdLength)
            {
                return BadRequest("Id must be a 6 character string");
            }

            if (await _chatRoomsRepo.GetChatRoomAsync(chatRoomToAdd.Id) != null)
            {
                return BadRequest("Id must be unique");
            }

            await _chatRoomsRepo.AddChatRoomAsync(chatRoomToAdd);

            return Ok();
        }

        [HttpPost("{chatRoomId}/user")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> AddUserToChatRoomAsync([FromRoute] string? chatRoomId, long? userToAddId)
        {
            if (string.IsNullOrEmpty(chatRoomId))
            {
                return BadRequest("Id must be a 6 character string");
            }
            
            if (userToAddId == null)
            {
                return BadRequest("User not specified");
            }

            try
            {
                await _chatRoomsRepo.AddUserToChatRoom(chatRoomId, userToAddId.Value);
                return Ok();
            }
            catch (ArgumentException argEx)
            {
                return BadRequest(argEx.Message);
            }
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ChatRoom>>> GetChatRooms()
        {
            return await _chatRoomsRepo.GetChatRoomsAsync();
        }

        [HttpGet("{chatRoomId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ChatRoom?>> GetChatRoom([FromRoute] string? chatRoomId)
        {
            if (string.IsNullOrEmpty(chatRoomId))
            {
                return BadRequest("Id must be a 6 character string!");
            }

            return await _chatRoomsRepo.GetChatRoomAsync(chatRoomId);
        }
    }
}

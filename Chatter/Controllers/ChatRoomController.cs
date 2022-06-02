using Chatter.Data;
using Chatter.Data.Models;
using Chatter.Data.Repos;
using Microsoft.AspNetCore.Mvc;

namespace Chatter.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatRoomController : ControllerBase
    {
        private readonly IChatRoomsRepo _chatRoomsRepo;
        private readonly IUsersRepo _usersRepo;

        public ChatRoomController(
            IChatRoomsRepo chatRoomsRepo,
            IUsersRepo usersRepo
        )
        {
            _chatRoomsRepo = chatRoomsRepo;
            _usersRepo = usersRepo;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> CreateChatRoomAsync(ChatRoomModel chatRoomToAdd)
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

            await _chatRoomsRepo.AddChatRoomAsync(
                new ChatRoom
                {
                    Id = chatRoomToAdd.Id,
                    Description = chatRoomToAdd.Description
                }
            );

            return Ok();
        }

        [HttpPost("{chatRoomId}/user")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult> AddUserToChatRoomAsync([FromRoute] string? chatRoomId, UserModel? userToAdd)
        {
            // Validate ChatRoom
            var chatRoom = await _chatRoomsRepo.GetChatRoomAsync(chatRoomId);
            if (chatRoom == null)
            {
                return BadRequest("Invalid ChatRoom");
            }

            // Validate User
            var user = await _usersRepo.GetUserAsync(userToAdd?.Id);
            if (user == null)
            {
                return BadRequest("Invalid User");
            }

            if (chatRoom.Users.Any(userInChatRoom => userInChatRoom.Id == user.Id))
            {
                // This probably shouldn't be a BadRequest; this error has to do with Business Logic
                return BadRequest("User is already in ChatRoom");
            }

            await _chatRoomsRepo.AddUserToChatRoom(chatRoom, user);

            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ChatRoomModel>>> GetChatRooms()
        {
            var chatRooms = await _chatRoomsRepo.GetChatRoomsAsync();

            return Ok(chatRooms.ToModels());
        }

        [HttpGet("{chatRoomId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ChatRoomModel?>> GetChatRoom([FromRoute] string? chatRoomId)
        {
            if (string.IsNullOrEmpty(chatRoomId) ||
                chatRoomId.Length != ChatRoom.IdLength)
            {
                return BadRequest("Id must be a 6 character string!");
            }

            var chatRoom = await _chatRoomsRepo.GetChatRoomAsync(chatRoomId);

            return Ok(chatRoom.ToModel());
        }
    }
}

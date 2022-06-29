using Chatter.Data;
using Chatter.Data.Entities;
using Chatter.Data.Models;
using Chatter.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Chatter.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<UserModel?>> RegisterAsync(RegistrationModel registrationDetails)
        {
            var addedUser = await _userService.RegisterAsync(
                registrationDetails.Username,
                registrationDetails.Password,
                registrationDetails.AvatarId
            );

            return Ok(addedUser.ToModel());
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<string>> LoginAsync(CredentialsModel credentials)
        {
            var jwt = await _userService.LoginAsync(
                credentials.Username,
                credentials.Password
            );

            return Ok(new AuthenticationModel(jwt));
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<User>>> GetUsersAsync()
        {
            var users = await _userService.GetUsersAsync();

            return Ok(users.ToModels());
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserModel?>> GetUserAsync([FromRoute] long userId)
        {
            var user = await _userService.GetUserAsync(userId);

            return Ok(user.ToModel());
        }

        [HttpGet("{userId}/chatrooms")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<ChatRoomModel>>> GetChatRoomsForUserAsync([FromRoute] long userId)
        {
            var user = await _userService.GetUserAsync(userId);

            if (user == null)
            {
                return Ok(new List<ChatRoomModel>());
            }
            else
            {
                return Ok(user.ChatRooms.ToModels());
            }
        }
    }
}

using Chatter.Data;
using Chatter.Data.Models;
using Chatter.Data.Repos;
using Microsoft.AspNetCore.Mvc;

namespace Chatter.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUsersRepo _usersRepo;

        public UserController(IUsersRepo usersRepo)
        {
            _usersRepo = usersRepo;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<UserModel?>> AddUserAync(User userToAdd)
        {
            if (string.IsNullOrEmpty(userToAdd.DisplayName))
            {
                return BadRequest("DisplayName cannot be empty");
            }
            if (await _usersRepo.GetUserAsync(userToAdd.DisplayName) != null)
            {
                return BadRequest("Please select a different DisplayName");
            }

            userToAdd.Id = 0;
            var createdUser = await _usersRepo.AddUserAsync(userToAdd);

            return Ok(createdUser.ToModel());
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<User>>> GetUsersAsync()
        {
            var users = await _usersRepo.GetUsersAsync();

            return Ok(users.ToModels());
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<UserModel?>> GetUserAsync([FromRoute] long userId)
        {
            var user = await _usersRepo.GetUserAsync(userId);

            return Ok(user.ToModel());
        }
    }
}

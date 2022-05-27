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
        public async Task<ActionResult<User?>> AddUserAync(User userToAdd)
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

            return Ok(createdUser);
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<User>>> GetUsersAsync()
        {
            return Ok(await _usersRepo.GetUsersAsync());
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<User?>> GetUserAsync([FromRoute] long userId)
        {
            return Ok(await _usersRepo.GetUserAsync(userId));
        }
    }
}

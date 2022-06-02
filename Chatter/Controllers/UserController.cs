using Chatter.Data;
using Chatter.Data.Models;
using Chatter.Data.Repos;
using Microsoft.AspNetCore.Authorization;
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

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<UserModel?>> RegisterAsync(LoginModel credentials)
        {
            if (string.IsNullOrEmpty(credentials.UserName) || string.IsNullOrEmpty(credentials.Password))
            {
                return BadRequest("Username and Password must be specified");
            }

            if ((await _usersRepo.GetUserAsync(credentials.UserName)) != null)
            {
                return BadRequest("Username is taken!");
            }

            // Todo: Hash password before storing in DB
            var userToAdd = new User
            {
                UserName = credentials.UserName,
                Password = credentials.Password
            };
            var addedUser = await _usersRepo.AddUserAsync(userToAdd);

            return Ok(addedUser.ToModel());
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

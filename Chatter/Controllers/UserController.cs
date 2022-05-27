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
        public async Task<List<User>> GetUsersAsync()
        {
            return await _usersRepo.GetUsersAsync();
        }

        [HttpGet("{userId}")]
        public async Task<User?> GetUserAsync([FromRoute] long userId)
        {
            return await _usersRepo.GetUserAsync(userId);
        }
    }
}

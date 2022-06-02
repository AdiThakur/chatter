using Chatter.Data;
using Chatter.Data.Models;
using Chatter.Data.Repos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Chatter.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IUsersRepo _usersRepo;

        public UserController(
            IConfiguration config,
            IUsersRepo usersRepo
        )
        {
            _config = config;
            _usersRepo = usersRepo;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<UserModel?>> RegisterAsync(CredentialsModel credentials)
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

        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> LoginAsync(CredentialsModel credentials)
        {
            var user = await _usersRepo.GetUserAsync(credentials.UserName);
            if (user == null)
            {
                return NotFound("User not found");
            }

            if (credentials.Password != user.Password)
            {
                return BadRequest("Incorrect Password");
            }

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var signingCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserName)
            };

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
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

using Chatter.Data.Entities;
using Chatter.Data.Repos;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Chatter.Services
{
    public interface IUserService
    {
        Task<User?> GetUserAsync(long userId);
        Task<List<User>> GetUsersAsync();
        Task<string> LoginAsync(string username, string password);
        Task<User?> RegisterAsync(string username, string password, string avatarId);
    }

    public class UserService : IUserService
    {
        private readonly IConfiguration _config;
        private readonly IPasswordService _passwordService;
        private readonly IAvatarService _avatarService;
        private readonly IUserRepo _userRepo;

        public UserService(
            IConfiguration config,
            IPasswordService passwordService,
            IAvatarService avatarService,
            IUserRepo userRepo
        )
        {
            _config = config;
            _passwordService = passwordService;
            _avatarService = avatarService;
            _userRepo = userRepo;
        }

        public async Task<User?> RegisterAsync(string username, string password, string avatarId)
        {
            if ((await _userRepo.GetUserAsync(username)) != null)
            {
                throw new UserException(
                    "Invalid Username",
                    "Please choose a different username"
                );
            }

            var avatarUri = _avatarService.GetUriFromId(avatarId);
            if (avatarUri == null)
            {
                throw new UserException(
                    "Invalid Avatar",
                    "Please specify a valid Avatar"
                );
            }

            var passwordHash = _passwordService.Hash(password);

            var userToAdd = new User
            {
                Username = username,
                PasswordHash = passwordHash,
                AvatarUri = avatarUri
            };

            return await _userRepo.AddUserAsync(userToAdd);
        }

        public async Task<string> LoginAsync(string username, string password)
        {
            var user = await _userRepo.GetUserAsync(username);
            if (user == null || !_passwordService.Verify(password, user.PasswordHash))
            {
                throw new UserException(
                     "Invalid Credentials",
                     "Incorrect username or password"
                 );
            }

            var claims = new List<Claim>
            {
                new("id", user.Id.ToString()),
                new("name", user.Username)
            };

            return GenerateJwt(claims);
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _userRepo.GetUsersAsync();
        }

        public async Task<User?> GetUserAsync(long userId)
        {
            return await _userRepo.GetUserWithChatRoomsAsync(userId);
        }

        private string GenerateJwt(List<Claim> claims)
        {
            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"])
            );
            var signingCredentials = new SigningCredentials(
                securityKey, SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                _config["Jwt:Issuer"],
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: signingCredentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

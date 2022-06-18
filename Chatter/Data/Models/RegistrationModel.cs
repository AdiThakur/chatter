using System.ComponentModel.DataAnnotations;

namespace Chatter.Data.Models
{
    public class RegistrationModel
    {
        [MinLength(5)]
        [MaxLength(20)]
        public string Username { get; set; }

        [MinLength(15)]
        [MaxLength(30)]
        public string Password { get; set; }

        public string AvatarId { get; set; }

        public RegistrationModel(string username, string password, string avatarId)
        {
            Username = username;
            Password = password;
            AvatarId = avatarId;
        }
    }
}
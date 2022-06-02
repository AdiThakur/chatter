using System.ComponentModel.DataAnnotations;

namespace Chatter.Data.Models
{
    public class CredentialsModel
    {
        [MinLength(5)]
        [MaxLength(20)]
        public string Username { get; set; }

        [MinLength(15)]
        [MaxLength(30)]
        public string Password { get; set; }

        public CredentialsModel(string username, string password)
        {
            Username = username;
            Password = password;
        }
    }
}

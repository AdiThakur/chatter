namespace Chatter.Data.Models
{
    public class CredentialsModel
    {
        public string Username { get; set; }

        public string Password { get; set; }

        public CredentialsModel(string username, string password)
        {
            Username = username;
            Password = password;
        }
    }
}

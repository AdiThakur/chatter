using BC = BCrypt.Net.BCrypt;

namespace Chatter.Services
{
    public interface IPasswordService
    {
        string Hash(string plainTextPassword);
        bool Verify(string plainTextPassword, string passwordHash);
    }

    public class PasswordService : IPasswordService
    {
        public string Hash(string plainTextPassword)
        {
            return BC.HashPassword(plainTextPassword);
        }

        public bool Verify(string plainTextPassword, string passwordHash)
        {
            return BC.Verify(plainTextPassword, passwordHash);
        }
    }
}

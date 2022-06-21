namespace Chatter.Data.Models;

public class AuthenticationModel
{
    public string Jwt { get; set; }

    public AuthenticationModel(string jwt)
    {
        Jwt = jwt;
    }
}
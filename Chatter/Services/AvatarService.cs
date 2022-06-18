namespace Chatter.Services
{
    public interface IAvatarService
    {
        string? GetUriFromId(string avatarId);
    }

    public class AvatarService : IAvatarService
    {
        private const string BaseUri = @"assets/";

        public string? GetUriFromId(string avatarId)
        {
            // TODO: Check if avatarId is valid; if not, return null
            return BaseUri + avatarId;
        }
    }
}
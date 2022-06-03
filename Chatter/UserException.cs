namespace Chatter
{
    public class UserException : Exception
    {
        public string Title { get; set; }

        public string? Description { get; set; }

        public UserException(string title, string? description = null)
        {
            Title = title;
            Description = description;
        }
    }
}

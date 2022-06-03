namespace Chatter
{
    public class UserException : Exception
    {
        public string Title { get; set; }

        public UserException(string title, string message) : base(message)
        {
            Title = title;
        }
    }
}

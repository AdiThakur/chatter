namespace Chatter.Data.Models
{
    public class ErrorDetails
    {
        public string Title { get; set; }

        public string Description { get; set; }

        public ErrorDetails(string title, string description)
        {
            Title = title;
            Description = description;
        }
    }
}

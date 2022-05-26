namespace Chatter.Data.Repos
{
    public class BaseRepo
    {
        protected readonly ChatterContext context;

        public BaseRepo(ChatterContext context)
        {
            this.context = context;
        }
    }
}

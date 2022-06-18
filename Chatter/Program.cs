using Chatter.Data;
using Chatter.Data.Models;
using Chatter.Data.Repos;
using Chatter.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Chatter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddDbContext<ChatterContext>();
            builder.Services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateLifetime = true,

                        ValidateIssuer = true,
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],

                        ValidateAudience = true,
                        ValidAudience = builder.Configuration["Jwt:Audience"],

                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    };
                });

            RegisterRepos(builder.Services);
            RegisterServices(builder.Services);

            var app = builder.Build();

            // Configure the HTTP request pipeline.

            app.UseExceptionHandler(options =>
            {
                options.Run(async (context) =>
                {
                    var contextFeature = context.Features.Get<IExceptionHandlerFeature>();

                    if (contextFeature != null &&
                        contextFeature.Error is UserException)
                    {
                        var error = (contextFeature.Error as UserException)!;
                        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                        context.Response.ContentType = "application/json";
                        await context.Response.WriteAsJsonAsync(
                            new ErrorDetails(error.Title, error.Description)
                        );
                    }
                });
            });

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }

        public static void RegisterRepos(IServiceCollection services)
        {
            services.AddScoped<IChatRoomsRepo, ChatRoomRepo>();
            services.AddScoped<MessageRepo>();
            services.AddScoped<IUsersRepo, UserRepo>();
        }

        public static void RegisterServices(IServiceCollection services)
        {
            services.AddSingleton<IPasswordService, PasswordService>();
            services.AddSingleton<IAvatarService, AvatarService>();
            // TODO: Want these to be Singletons, but they're lightweight and stateless, so Scoped shouldn't be too bad for now
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IChatRoomService, ChatRoomService>();
        }
    }
}

// TODO
// - Add MessageController
// - Add tests for MessageController
// - Cleanup Program.cs

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Chatter.Migrations
{
    public partial class AddedAvatarToUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AvatarUri",
                table: "Users",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AvatarUri",
                table: "Users");
        }
    }
}

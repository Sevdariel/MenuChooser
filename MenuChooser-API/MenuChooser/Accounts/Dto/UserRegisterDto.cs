namespace MenuChooser.Accounts.Dto
{
    public class UserRegisterDto
    {
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required bool TermsOfUse { get; set; }
        public required bool PrivacyPolicy { get; set; }
    }
}

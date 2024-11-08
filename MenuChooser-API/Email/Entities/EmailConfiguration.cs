namespace Email.Entities
{
    public class EmailConfiguration
    {
        public string From { get; set; } = null!;
        public string FromMail { get; set; } = null!;
        public string SmtpServer { get; set; } = null!;
        public int Port { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}

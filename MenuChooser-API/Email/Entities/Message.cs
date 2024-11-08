using MimeKit;

namespace Email.Entities
{
    public class Message
    {
        public List<MailboxAddress> To { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Content { get; set; } = null!;

        public Message(IEnumerable<string> to, string subject, string content)
        {
            To = [.. to.Select(x => new MailboxAddress(x, x))];
            Subject = subject;
            Content = content;
        }
    }
}

using MimeKit;

namespace Email.Entities
{
    internal class Message
    {
        public List<MailboxAddress> To { get; set; } = null!;
        public string Subject { get; set; } = null!;
        public string Content { get; set; } = null!;

        public Message(IEnumerable<string> to, string subject, string content)
        {
            To = new List<MailboxAddress>();

            To.AddRange(to.Select(x => new MailboxAddress(x, x)));
            Subject = subject;
            Content = content;
        }
    }
}

using Email.Entities;

namespace Email.Interface
{
    public interface IEmailSender
    {
        Task SendEmailAsync(Message message);
    }
}

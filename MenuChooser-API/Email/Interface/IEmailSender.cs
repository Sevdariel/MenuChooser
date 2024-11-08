using Users.Entities;

namespace Email.Interface
{
    public interface IEmailSender
    {
        void SendEmail(User user);
        Task SendEmailAsync(User user);
    }
}

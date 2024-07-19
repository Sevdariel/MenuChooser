using Email.Entities;
using Email.Interface;
using MenuChooser.Email;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Email.Service
{
    public class EmailSender : IEmailSender
    {
        private readonly IOptions<EmailConfiguration> _configuration;
        public EmailSender(IOptions<EmailConfiguration> configuration) {
            _configuration = configuration;
        }

        void IEmailSender.SendEmail(Message message)
        {
            var emailMessage = CreateEmailMessage(message);

            Send(emailMessage);
        }

        private MimeMessage CreateEmailMessage(Message message)
        {
            throw new NotImplementedException();
        }

        private void Send(MimeMessage mailMessage)
        {

        }
    }
}

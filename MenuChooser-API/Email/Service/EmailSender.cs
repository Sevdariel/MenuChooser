using Email.Entities;
using Email.Interface;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Email.Service
{
    public class EmailSender : IEmailSender
    {
        private readonly IOptions<EmailConfiguration> _configuration;
        public EmailSender(IOptions<EmailConfiguration> configuration)
        {
            _configuration = configuration;
        }

        void IEmailSender.SendEmail(Message message)
        {
            var emailMessage = CreateEmailMessage(message);

            Send(emailMessage);
        }

        private MimeMessage CreateEmailMessage(Message message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_configuration.Value.From, _configuration.Value.FromMail));
            emailMessage.To.Add(new MailboxAddress("Nazwa użytkownika", "mail użytkownika"));
            // ToDo: Change subject to internationalization
            emailMessage.Subject = "Reset password";
            emailMessage.Body = new TextPart("plain")
            {
                Text = message.Subject,
            };

            return emailMessage;
        }

        private void Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_configuration.Value.SmtpServer, _configuration.Value.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_configuration.Value.Username, _configuration.Value.Password);

                    client.Send(mailMessage);
                }
                catch (Exception)
                {
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
    }
}

using Email.Entities;
using Email.Interface;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using Users.Service;

namespace Email.Service
{
    public class EmailSender : IEmailSender
    {
        private readonly IOptions<EmailConfiguration> _configuration;
        private readonly UserService _userService;
        public EmailSender(IOptions<EmailConfiguration> configuration,
            UserService userService)
        {
            _configuration = configuration;
            _userService = userService;
        }

        public async Task SendEmailAsync(Message message)
        {
            var emailMessage = CreateEmailMessage(message.To, message.Content, message.Subject);

            await SendAsync(emailMessage);
        }

        private MimeMessage CreateEmailMessage(List<MailboxAddress> users, string messageContent, string subject)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_configuration.Value.Username, _configuration.Value.From));
            emailMessage = AddReceiverInfo(emailMessage, users);
            emailMessage.Subject = subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = messageContent,
            };

            return emailMessage;
        }

        private MimeMessage AddReceiverInfo(MimeMessage message, List<MailboxAddress> users)
        {
            foreach (var user in users) {
                message.To.Add(user);
            }

            return message;
        }

        private async Task SendAsync(MimeMessage mailMessage)
        { 
            using (var client = new SmtpClient())
            {
                try
                {
                    client.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;

                    await client.ConnectAsync(_configuration.Value.SmtpServer, _configuration.Value.Port, MailKit.Security.SecureSocketOptions.StartTls);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.AuthenticateAsync(_configuration.Value.Username, _configuration.Value.Password);

                    await client.SendAsync(mailMessage);
                }
                catch (Exception ex)
                {
                    var errorMessage = $"Failed to send email. Error details:\n" +
                             $"Server: {_configuration.Value.SmtpServer}\n" +
                             $"Port: {_configuration.Value.Port}\n" +
                             $"Username: {_configuration.Value.Username}\n" +
                             $"Error: {ex.Message}\n" +
                             $"Stack Trace: {ex.StackTrace}";
            
                    throw new Exception(errorMessage, ex);
                }
                finally
                {
                    await client.DisconnectAsync(true);
                    client.Dispose();
                }
            }
        }
    }
}

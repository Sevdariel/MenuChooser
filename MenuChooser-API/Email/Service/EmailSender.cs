using Email.Entities;
using Email.Interface;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using Users.Entities;
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

        public void SendEmail(User user)
        {
            var emailMessage = CreateEmailMessage(user);

            Send(emailMessage);
        }

        public async Task SendEmailAsync(User user)
        {
            var emailMessage = CreateEmailMessage(user);

            await SendAsync(emailMessage);
        }


        private MimeMessage CreateEmailMessage(User user)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress(_configuration.Value.From, _configuration.Value.FromMail));
            emailMessage = AddReceiverInfo(emailMessage, user);
            // ToDo: Change subject to internationalization
            emailMessage.Subject = "Reset password";
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = string.Format("<h2 style='color:red'>{0}</h2>", "Treść wiadomości"),
            };

            return emailMessage;
        }

        private MimeMessage AddReceiverInfo(MimeMessage message, User user)
        {
            message.To.Add(new MailboxAddress(user.Username, user.Email));

            return message;
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

        private async Task SendAsync(MimeMessage mailMessage)
        { 
            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_configuration.Value.SmtpServer, _configuration.Value.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.AuthenticateAsync(_configuration.Value.Username, _configuration.Value.Password);

                    await client.SendAsync(mailMessage);
                }
                catch (Exception)
                {
                    throw;
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

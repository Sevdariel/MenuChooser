using Email.Entities;

namespace Email.Interface
{
    internal interface IEmailSender
    {
        void SendEmail(Message message);
    }
}

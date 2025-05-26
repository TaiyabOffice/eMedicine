using System.Net.Sockets;
using System.Net;

namespace eMedicineAdmin.Models
{
    public class VisitorService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public VisitorService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public string GetVisitorDetails()
        {
            string ipAddress = string.Empty;

            // Retrieve the current HTTP context
            var context = _httpContextAccessor.HttpContext;

            if (context == null)
            {
                return ipAddress; // Return empty if no context is available
            }

            // Check for forwarded headers (e.g., behind a proxy or load balancer)
            ipAddress = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();

            if (string.IsNullOrEmpty(ipAddress))
            {
                // Fall back to remote IP address
                ipAddress = context.Connection.RemoteIpAddress?.ToString();
            }

            // If IP is localhost (::1), resolve to the local machine's external IP
            if (string.IsNullOrEmpty(ipAddress) || ipAddress == "::1")
            {
                var host = Dns.GetHostEntry(Dns.GetHostName());
                var localIp = host.AddressList.FirstOrDefault(x => x.AddressFamily == AddressFamily.InterNetwork);

                ipAddress = localIp?.ToString() ?? string.Empty;
            }

            return ipAddress;
        }
    }
}

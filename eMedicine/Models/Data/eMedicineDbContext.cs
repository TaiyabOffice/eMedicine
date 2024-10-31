using Microsoft.Data.SqlClient;
using System.Data;

namespace eMedicine.Models.Data
{
    public class eMedicineDbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string connectionstring;
        public eMedicineDbContext(IConfiguration configuration)
        {
            this._configuration = configuration;
            this.connectionstring = this._configuration.GetConnectionString("connection");
        }
        public IDbConnection CreateConnection() => new SqlConnection(connectionstring);
    }
}

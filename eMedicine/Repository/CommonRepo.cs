using Dapper;
using eMedicine.IRepository;
using eMedicine.Models;
using eMedicine.Models.Data;
using System.Data;
using System.Transactions;

namespace eMedicine.Repository
{
    public class CommonRepo: ICommonRepo
    {
        DataTable dt;
        DataSet ds;
        private readonly eMedicineDbContext context;
        public CommonRepo(eMedicineDbContext context)
        {
            this.context = context;
        } 

        public async Task<DataSet> GetAll(string comCostID, string ProcName, string CallType,
        string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "",
        string parm9 = "", string parm10 = "", string parm11 = "", string parm12 = "", string parm13 = "", string parm14 = "", string parm15 = "",
        string parm16 = "", string parm17 = "", string parm18 = "", string parm19 = "", string parm20 = "")
        {
            
            var param = new DynamicParameters();
            param.Add("@ComC1", comCostID);
            param.Add("@CallType", CallType);
            param.Add("@Desc1", parm1);
            param.Add("@Desc2", parm2);
            param.Add("@Desc3", parm3);
            param.Add("@Desc4", parm4);
            param.Add("@Desc5", parm5);
            param.Add("@Desc6", parm6);
            param.Add("@Desc7", parm7);
            param.Add("@Desc8", parm8);
            param.Add("@Desc9", parm9);
            param.Add("@Desc10", parm10);
            param.Add("@Desc11", parm11);
            param.Add("@Desc12", parm12);
            param.Add("@Desc13", parm13);
            param.Add("@Desc14", parm14);
            param.Add("@Desc15", parm15);
            param.Add("@Desc16", parm16);
            param.Add("@Desc17", parm17);
            param.Add("@Desc18", parm18);
            param.Add("@Desc19", parm19);
            param.Add("@Desc20", parm20);

            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {

                using (var connection = this.context.CreateConnection())
                    {
                    try
                    {
                        var list = await SqlMapper.ExecuteReaderAsync(connection, ProcName, param, commandType: CommandType.StoredProcedure);
                        var dataset = ConvertDataReaderToDataSet(list);
                        transactionScope.Complete();
                        transactionScope.Dispose();
                        return dataset;
                    }
                    catch (Exception ex)
                    {
                        transactionScope.Dispose();
                        return null;
                    }
                    finally
                    {
                        connection.Close();
                    }
                }
                
            }
        }

        public async Task<DataSet> SaveUsingDataSet(string comCostID, string ProcName, string CallType, DataSet parmXmlu = null, DataSet parmXmld = null,
       string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "",
       string parm9 = "", string parm10 = "", string parm11 = "", string parm12 = "", string parm13 = "", string parm14 = "", string parm15 = "",
       string parm16 = "", string parm17 = "", string parm18 = "", string parm19 = "", string parm20 = "")
        {
            var param = new DynamicParameters();
            param.Add("@ComC1", comCostID);
            param.Add("@CallType", CallType);
            param.Add("@dsxmlu", parmXmlu == null ? null : parmXmlu.GetXml(), DbType.Xml);
            param.Add("@dsxmld", parmXmld == null ? null : parmXmld.GetXml(), DbType.Xml);
            param.Add("@Desc1", parm1);
            param.Add("@Desc2", parm2);
            param.Add("@Desc3", parm3);
            param.Add("@Desc4", parm4);
            param.Add("@Desc5", parm5);
            param.Add("@Desc6", parm6);
            param.Add("@Desc7", parm7);
            param.Add("@Desc8", parm8);
            param.Add("@Desc9", parm9);
            param.Add("@Desc10", parm10);
            param.Add("@Desc11", parm11);
            param.Add("@Desc12", parm12);
            param.Add("@Desc13", parm13);
            param.Add("@Desc14", parm14);
            param.Add("@Desc15", parm15);
            param.Add("@Desc16", parm16);
            param.Add("@Desc17", parm17);
            param.Add("@Desc18", parm18);
            param.Add("@Desc19", parm19);
            param.Add("@Desc20", parm20);

            using (var transactionScope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {

                using (var connection = this.context.CreateConnection())
                {
                    try
                    {
                        var list = await SqlMapper.ExecuteReaderAsync(connection, ProcName, param, commandType: CommandType.StoredProcedure);
                        var dataset = ConvertDataReaderToDataSet(list);
                        transactionScope.Complete();
                        transactionScope.Dispose();
                        return dataset;
                    }
                    catch (Exception ex)
                    {
                        transactionScope.Dispose();
                        return null;
                    }
                    finally
                    {
                        connection.Close();
                    }
                }

            }
        }

        public DataSet ConvertDataReaderToDataSet(IDataReader data)
        {
            DataSet ds = new DataSet();
            int i = 0;
            while (!data.IsClosed)
            {
                ds.Tables.Add("Table" + (i + 1));
                ds.EnforceConstraints = false;
                ds.Tables[i].Load(data);
                i++;
            }
            return ds;
        }

    }
}

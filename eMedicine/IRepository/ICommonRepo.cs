using eMedicine.Models;
using System.Data;

namespace eMedicine.IRepository
{
    public interface ICommonRepo
    {
        Task<DataSet> GetAll(string comCostID, string ProcName, string CallType,
        string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "",
        string parm9 = "", string parm10 = "", string parm11 = "", string parm12 = "", string parm13 = "", string parm14 = "", string parm15 = "",
        string parm16 = "", string parm17 = "", string parm18 = "", string parm19 = "", string parm20 = "");

        Task<DataSet> SaveUsingDataSet(string comCostID, string ProcName, string CallType, DataSet parmXmlu = null, DataSet parmXmld = null,
       string parm1 = "", string parm2 = "", string parm3 = "", string parm4 = "", string parm5 = "", string parm6 = "", string parm7 = "", string parm8 = "",
       string parm9 = "", string parm10 = "", string parm11 = "", string parm12 = "", string parm13 = "", string parm14 = "", string parm15 = "",
       string parm16 = "", string parm17 = "", string parm18 = "", string parm19 = "", string parm20 = "");
    }
}

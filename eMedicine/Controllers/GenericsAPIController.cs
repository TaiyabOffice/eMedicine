using eMedicine.IRepository;
using eMedicine.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace eMedicine.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenericsAPIController : ControllerBase
    {
        DataSet ds = new DataSet();
        private readonly ICommonRepo repo;
        public GenericsAPIController(ICommonRepo repo)
        {
            this.repo = repo;
        }
        [HttpGet("GetAllGenerics")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var ds = await repo.GetAll("", "sp_SelectGenerics", "GETALLGENERICS");


                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Generics>(), Message = "No Generics found." });
                }
                var GetGenericsDetails = (from DataRow dr in ds.Tables[0].Rows
                                          select new Generics()
                                          {
                                              GenericsId = dr["GenericsId"].ToString(),
                                              GenericsName = dr["GenericsName"].ToString(),
                                              GenericsDescription = dr["GenericsDescription"].ToString(),
                                              Indications = dr["Indications"].ToString(),
                                              Contraindications = dr["Contraindications"].ToString(),
                                              TherapeuticClass = dr["TherapeuticClass"].ToString(),
                                              SideEffects = dr["TherapeuticClass"].ToString(),
                                              Precautions = dr["Precautions"].ToString(),
                                              Interactions = dr["Interactions"].ToString(),
                                              GenericsNameBN = dr["GenericsNameBN"].ToString(),
                                              GenericsDescriptionBN = dr["GenericsDescriptionBN"].ToString(),
                                              IndicationsBN = dr["IndicationsBN"].ToString(),
                                              ContraindicationsBN = dr["ContraindicationsBN"].ToString(),
                                              TherapeuticClassBN = dr["TherapeuticClassBN"].ToString(),
                                              SideEffectsBN = dr["SideEffectsBN"].ToString(),
                                              PrecautionsBN = dr["PrecautionsBN"].ToString(),
                                              InteractionsBN = dr["InteractionsBN"].ToString(),
                                              IsActive = dr["IsActive"].ToString()
                                          }).ToList();
                return new JsonResult(new { Success = true, Data = GetGenericsDetails });
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Generics.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost("CreateGenerics")]
        public async Task<IActionResult> CreateGenerics([FromBody] Generics Generics)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryGenerics", "CREATEGENERICS", Generics.GenericsId, Generics.GenericsName, Generics.GenericsDescription,
                    Generics.Indications, Generics.Contraindications, Generics.TherapeuticClass, Generics.SideEffects, Generics.Precautions, Generics.Interactions, Generics.GenericsNameBN, Generics.GenericsDescriptionBN,
                    Generics.IndicationsBN, Generics.ContraindicationsBN, Generics.TherapeuticClassBN, Generics.SideEffectsBN, Generics.PrecautionsBN, Generics.InteractionsBN, Generics.IsActive, Generics.CreatedBy,
                    Generics.CreatedDate);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Generics>(), Message = "Generics Create Failed." });
                }
                else
                {
                    return new JsonResult(new { Success = true, Data = new List<Generics>(), Message = "Generics Create Successfully." });
                }

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Generics.",
                    Details = ex.Message
                });
            }
        }

        [HttpGet("GetGenericsById/{GenericsId}")]
        public async Task<IActionResult> GetGenericsById(string GenericsId)
        {
            try
            {
                var ds = await this.repo.GetAll("", "sp_SelectGenerics", "GETGENERICSBYID", GenericsId);
                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Generics>(), Message = "No Generics found." });
                }
                var GetGenericsDetails = (from DataRow dr in ds.Tables[0].Rows
                                          select new Generics()
                                          {
                                              GenericsId = dr["GenericsId"].ToString(),
                                              GenericsName = dr["GenericsName"].ToString(),
                                              GenericsDescription = dr["GenericsDescription"].ToString(),
                                              Indications = dr["Indications"].ToString(),
                                              Contraindications = dr["Contraindications"].ToString(),
                                              TherapeuticClass = dr["TherapeuticClass"].ToString(),
                                              SideEffects = dr["TherapeuticClass"].ToString(),
                                              Precautions = dr["Precautions"].ToString(),
                                              Interactions = dr["Interactions"].ToString(),
                                              GenericsNameBN = dr["GenericsNameBN"].ToString(),
                                              GenericsDescriptionBN = dr["GenericsDescriptionBN"].ToString(),
                                              IndicationsBN = dr["IndicationsBN"].ToString(),
                                              ContraindicationsBN = dr["ContraindicationsBN"].ToString(),
                                              TherapeuticClassBN = dr["TherapeuticClassBN"].ToString(),
                                              SideEffectsBN = dr["SideEffectsBN"].ToString(),
                                              PrecautionsBN = dr["PrecautionsBN"].ToString(),
                                              InteractionsBN = dr["InteractionsBN"].ToString(),
                                              IsActive = dr["IsActive"].ToString()
                                          }).ToList();

                return new JsonResult(new { Success = true, Data = GetGenericsDetails });

            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Generics.",
                    Details = ex.Message
                });
            }

        }

        [HttpPost("UpdateGenericsById")]
        public async Task<IActionResult> UpdateGenericsById([FromBody] Generics Generics)
        {
            try
            {

                var ds = await this.repo.GetAll("", "sp_EntryGenerics", "UPDATEGENERICSBYID", Generics.GenericsId, Generics.GenericsName, Generics.GenericsDescription,
                    Generics.Indications, Generics.Contraindications, Generics.TherapeuticClass, Generics.SideEffects, Generics.Precautions, Generics.Interactions, Generics.GenericsNameBN, Generics.GenericsDescriptionBN,
                    Generics.IndicationsBN, Generics.ContraindicationsBN, Generics.TherapeuticClassBN, Generics.SideEffectsBN, Generics.PrecautionsBN, Generics.InteractionsBN, Generics.IsActive, Generics.Updatedby,
                    Generics.UpdatedDate);

                if (ds == null || ds.Tables.Count == 0 || ds.Tables[0].Rows.Count == 0)
                {
                    return new JsonResult(new { Success = false, Data = new List<Generics>(), Message = "Generics Update Failed." });
                }
                else
                {

                    return new JsonResult(new { Success = true, Data = new List<Generics>(), Message = "Generics Update Successfully." });
                }
            }
            catch (Exception ex)
            {
                return new JsonResult(StatusCodes.Status500InternalServerError, new
                {
                    Success = false,
                    Message = "An error occurred while retrieving the Generics.",
                    Details = ex.Message
                });
            }
        }
    }
}

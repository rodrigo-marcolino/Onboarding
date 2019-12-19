using System.Collections.Generic;
using System.Linq;
using Boilerplate.Web.App.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Dynamic.Core;

namespace Boilerplate.Web.App.Controllers
{
    public class SalesController : Controller
    {
        // GET: Sales/SalesList
        [HttpGet]
        public JsonResult SalesList(string sortColumnName, string sortOrder, int pageSize, int currentPage)
        {

            List<Sales> list = new List<Sales>();
            int totalPage = 0;
            int totalRecord = 0;

            using (var db = new OnboardingContext())
            {
                var sales = db.Sales;
                totalRecord = sales.Count();

                if (pageSize > 0)
                {
                    totalPage = totalRecord / pageSize + ((totalRecord % pageSize) > 0 ? 1 : 0);
                    list = sales.Select(x => new Sales()
                    {
                        Id = x.Id,
                        Customer = x.Customer,
                        Product = x.Product,
                        Store = x.Store,
                        DateSold = x.DateSold
                    }).OrderBy(sortColumnName + " " + sortOrder).Skip(pageSize * (currentPage - 1)).Take(pageSize).ToList();
                }
                else
                {
                    list = sales.ToList();
                }


                var result = new { list = list, totalRecord = totalRecord, totalPage = totalPage };

                return Json(result);
            }
        }

        // POST: Sales/CreateSales
        [HttpPost]
        public ActionResult CreateSales([FromBody] Sales sales)
        {
            using (var db = new OnboardingContext())
            {
                if (ModelState.IsValid)
                {
                    db.Sales.Add(sales);
                    db.SaveChanges();
                    return StatusCode(StatusCodes.Status201Created);
                }

                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest);
                }

            }
        }

        // PUT: Sales/EditSales
        [HttpPut]
        public ActionResult EditSales(int id, [FromBody] Sales sales)
        {
            using (var db = new OnboardingContext())
            {
                if (ModelState.IsValid)
                {
                    var entity = db.Sales.Find(id);
                    entity.CustomerId = sales.CustomerId;
                    entity.ProductId = sales.ProductId;
                    entity.StoreId = sales.StoreId;
                    entity.DateSold = sales.DateSold;
                    db.SaveChanges();

                    return Ok("Record Updated Succesfully...");
                }
                else
                {
                    return NotFound("No record has been found against this id");
                }
            }
        }

        // DELETE: Sales/DeleteDeleteSales/#
        [HttpDelete]
        public ActionResult DeleteSales(int id)
        {
            using (var db = new OnboardingContext())
            {
                try
                {
                    var entity = db.Sales.Find(id);
                    db.Sales.Remove(entity);
                    db.SaveChanges();
                    return Ok("Code deleted");
                }
                catch
                {
                    throw;
                }
            }
        }
    }
}
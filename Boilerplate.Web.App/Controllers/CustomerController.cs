using System.Collections.Generic;
using System.Linq;
using Boilerplate.Web.App.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Dynamic.Core;

namespace Boilerplate.Web.App.Controllers
{
    public class CustomerController : Controller
    {

        // GET: Customer/CustomerListSales ***This is for the sales Dropdown options
        [HttpGet]
        public JsonResult CustomerListSales()
        {
            using (var db = new OnboardingContext())
            {
                var customers = db.Customer.Select(x => new Customer()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Address = x.Address
                }).ToList();

                return Json(customers);
            }
        }

        // GET: Customer/CustomerList
        [HttpGet]
        public JsonResult CustomerList(string sortColumnName, string sortOrder, int pageSize, int currentPage)
        {

            List<Customer> list = new List<Customer>();
            int totalPage = 0;
            int totalRecord = 0;

            using (var db = new OnboardingContext())
            {
                var customers = db.Customer;
                totalRecord = customers.Count();

                if (pageSize > 0)
                {
                    totalPage = totalRecord / pageSize + ((totalRecord % pageSize) > 0 ? 1 : 0);
                    list = customers.Select(x => new Customer()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Address = x.Address
                    }).OrderBy(sortColumnName + " " + sortOrder).Skip(pageSize * (currentPage - 1)).Take(pageSize).ToList();
                }
                else
                {
                    list = customers.ToList();
                }


                var result = new { list = list, totalRecord = totalRecord, totalPage = totalPage };

                return Json(result);
            }
        }

        // POST: Customer/CreateCustomer
        [HttpPost]
        public ActionResult CreateCustomer([FromBody] Customer customer)
        {
            using (var db = new OnboardingContext())
            {
                if (ModelState.IsValid)
                {
                    db.Customer.Add(customer);
                    db.SaveChanges();
                    return StatusCode(StatusCodes.Status201Created);
                }

                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest);
                }

            }
        }

        // PUT: Customer/EditCustomer/#
        [HttpPut]
        public ActionResult EditCustomer(int id, [FromBody] Customer customer)
        {
            using (var db = new OnboardingContext())
            {
                if (ModelState.IsValid)
                {
                    var entity = db.Customer.Find(id);
                    entity.Name = customer.Name;
                    entity.Address = customer.Address;
                    db.SaveChanges();

                    return Ok("Record Updated Succesfully...");
                }
                else
                {
                    return NotFound("No record has been found against this id");
                }
            }
        }

        // DELETE: Customer/DeleteDeleteCustomer/#
        [HttpDelete]
        public ActionResult DeleteCustomer(int id)
        {
            using (var db = new OnboardingContext())
            {
                try
                {
                    var entity = db.Customer.Find(id);
                    db.Customer.Remove(entity);
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
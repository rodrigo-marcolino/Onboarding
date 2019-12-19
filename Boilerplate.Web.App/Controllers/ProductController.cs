using System.Collections.Generic;
using System.Linq;
using Boilerplate.Web.App.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Dynamic.Core;

namespace Boilerplate.Web.App.Controllers
{
    public class ProductController : Controller
    {

        // GET: Product/ProductListListSales ***This is for the sales Dropdown options
        [HttpGet]
        public JsonResult ProductListSales()
        {
            using (var db = new OnboardingContext())
            {
                var products = db.Product.Select(x => new Product()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Price = x.Price
                }).ToList();

                return Json(products);
            }
        }

        // GET: Product/ProductList
        [HttpGet]
        public JsonResult ProductList(string sortColumnName, string sortOrder, int pageSize, int currentPage)
        {

            List<Product> list = new List<Product>();
            int totalPage = 0;
            int totalRecord = 0;

            using (var db = new OnboardingContext())
            {
                var products = db.Product;
                totalRecord = products.Count();

                if (pageSize > 0)
                {
                    totalPage = totalRecord / pageSize + ((totalRecord % pageSize) > 0 ? 1 : 0);
                    list = products.Select(x => new Product()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Price = x.Price
                    }).OrderBy(sortColumnName + " " + sortOrder).Skip(pageSize * (currentPage - 1)).Take(pageSize).ToList();
                }
                else
                {
                    list = products.ToList();
                }


                var result = new { list = list, totalRecord = totalRecord, totalPage = totalPage };

                return Json(result);
            }
        }


        // POST: Product/CreateProduct
        [HttpPost]
        public ActionResult CreateProduct([FromBody] Product product)
        {
            using (var db = new OnboardingContext())
            {
                if (ModelState.IsValid)
                {
                    db.Product.Add(product);
                    db.SaveChanges();
                    return StatusCode(StatusCodes.Status201Created);
                }

                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest);
                }

            }
        }

        // PUT: Product/EditProduct/#
        [HttpPut]
        public ActionResult EditProduct(int id, [FromBody] Product product)
        {
            using (var db = new OnboardingContext())
            {
                if (ModelState.IsValid)
                {
                    var entity = db.Product.Find(id);
                    entity.Name = product.Name;
                    entity.Price = product.Price;
                    db.SaveChanges();
                    return Ok("Record Updated Succesfully...");
                }
                else
                {
                    return NotFound("No record has been found against this id");
                }
            }
        }

        // DELETE: Product/DeleteDeleteProduct/#
        [HttpDelete]
        public ActionResult DeleteProduct(int id)
        {
            using (var db = new OnboardingContext())
            {
                try
                {
                    var entity = db.Product.Find(id);
                    db.Product.Remove(entity);
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
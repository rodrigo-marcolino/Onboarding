using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace Boilerplate.Web.App.Models
{
    public partial class Product
    {
        public Product()
        {
            ProductSold = new HashSet<Sales>();
        }

        [ScaffoldColumn(false)]
        public int Id { get; set; }


        [DisplayName("Product Name")]
        [Required(ErrorMessage = "Product Name is required")]
        [StringLength(50)]
        public string Name { get; set; }

        [Required(ErrorMessage = "Product Price is required")]
        public decimal Price { get; set; }

        public ICollection<Sales> ProductSold { get; set; }
    }
}

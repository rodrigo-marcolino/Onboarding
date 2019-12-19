﻿using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Boilerplate.Web.App.Models;

namespace Boilerplate.Web.App.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }


        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

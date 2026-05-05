using Microsoft.AspNetCore.Mvc;

namespace WhackAMole.Controllers;

public class GameController : Controller
{
    public IActionResult Index()
    {
        return View();
    }
}

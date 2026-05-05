using Microsoft.AspNetCore.Mvc;

namespace WhackAMole.Controllers;

public class GameController : Controller
{
    public IActionResult Index() => View();

    [HttpPost]
    public IActionResult SaveScore([FromBody] ScoreRequest req)
    {
        var scores = HttpContext.Session.GetString("scores");
        var list = string.IsNullOrEmpty(scores)
            ? new List<ScoreEntry>()
            : System.Text.Json.JsonSerializer.Deserialize<List<ScoreEntry>>(scores)!;

        list.Add(new ScoreEntry { Name = req.Name, Score = req.Score, Date = DateTime.Now.ToString("MMM d") });
        list = list.OrderByDescending(s => s.Score).Take(10).ToList();

        HttpContext.Session.SetString("scores", System.Text.Json.JsonSerializer.Serialize(list));
        return Json(list);
    }

    [HttpGet]
    public IActionResult Scores()
    {
        var scores = HttpContext.Session.GetString("scores");
        var list = string.IsNullOrEmpty(scores)
            ? new List<ScoreEntry>()
            : System.Text.Json.JsonSerializer.Deserialize<List<ScoreEntry>>(scores)!;
        return Json(list);
    }
}

public class ScoreRequest { public string Name { get; set; } = ""; public int Score { get; set; } }
public class ScoreEntry  { public string Name { get; set; } = ""; public int Score { get; set; } public string Date { get; set; } = ""; }

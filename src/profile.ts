const userId = localStorage.getItem("userId");

if (!userId) {
  alert("No user connected!");
  window.location.href = "/login.html";
} else {
  fetch(`http://localhost:5166/api/user/stats/${parseInt(userId)}`)
    .then((res) => {
      if (!res.ok) throw new Error("Kunde inte hämta statistik");
      return res.json();
    })
    .then((data) => {
      (document.getElementById("username") as HTMLSpanElement).textContent =
        data.username;
      (document.getElementById("games") as HTMLSpanElement).textContent =
        data.gamesPlayed;
      (document.getElementById("wins") as HTMLSpanElement).textContent =
        data.wins;
      (document.getElementById("losses") as HTMLSpanElement).textContent =
        data.losses;
    })
    .catch((err) => {
      console.error("Fel vid hämtning:", err);
    });
}

// Tillbaka-knapp
document.getElementById("backBtn")?.addEventListener("click", () => {
  window.location.href = "/home.html";
});

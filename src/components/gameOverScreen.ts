export function showGameOverScreen(onRestart: () => void) {
  // Tạo popup
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.width = "300px";
  popup.style.height = "150px";
  popup.style.background = "white";
  popup.style.border = "1px solid #ccc";
  popup.style.borderRadius = "5px";
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  popup.style.padding = "20px";
  popup.style.zIndex = "1000";
  popup.innerHTML = `
    <h2>Game Over</h2>
    <p>You lost! Try again?</p>
    <button id="restart-button">Restart Game</button>
  `;
  document.body.appendChild(popup);

  const restartButton = document.getElementById("restart-button");
  if (restartButton) {
    restartButton.addEventListener("click", () => {
      window.location.reload();
      onRestart();
    });
  }
}

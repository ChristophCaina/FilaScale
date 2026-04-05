/**
 * FilaScale Web Installer
 */

(function () {
  const btn = document.getElementById("esp-install-btn");
  const warning = document.getElementById("browser-warning");

  // Show warning and hide button if Web Serial is not supported
  if (!("serial" in navigator)) {
    if (warning) warning.hidden = false;
    if (btn) btn.style.display = "none";
  }
})();

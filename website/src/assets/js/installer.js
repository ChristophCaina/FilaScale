/**
 * FilaScale Web Installer
 * Handles variant selection and ESP Web Tools integration
 */

(function () {
  const select = document.getElementById("variant-select");
  const btn = document.getElementById("esp-install-btn");
  const warning = document.getElementById("browser-warning");

  // Check Web Serial support
  if (!("serial" in navigator)) {
    if (warning) warning.hidden = false;
    if (btn) btn.style.display = "none";
  }

  // Update manifest when variant changes
  if (select && btn) {
    select.addEventListener("change", () => {
      const variant = select.value;
      btn.setAttribute(
        "manifest",
        `/assets/firmware/${variant}.json`
      );
    });
  }
})();

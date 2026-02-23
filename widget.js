async function loadLatest() {
  const root = document.getElementById("ig-root");
  root.textContent = "";

  let permalink = "";
  try {
    const res = await fetch("./latest.json", { cache: "no-store" });
    const json = await res.json();
    permalink = (json?.permalink || "").trim();
  } catch {
    root.textContent = "Could not load latest post.";
    return;
  }

  if (!permalink) {
    root.textContent = "No post set yet.";
    return;
  }

  // Ensure permalink ends with /
  if (!permalink.endsWith("/")) permalink += "/";

  // Caption ON via data-instgrm-captioned
  root.innerHTML = `
      <div class="ig-scale" id="ig-scale">
        <blockquote
          class="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink="${permalink}"
          data-instgrm-version="14"
          style="background:#FFF;border:none!important;border-radius:3px;margin:0;width:100%;">
        </blockquote>
        </div>
      `;

  // If embed.js is already loaded, process immediately.
  if (window.instgrm?.Embeds?.process) {
    window.instgrm.Embeds.process();
    return;
  }

  // Otherwise wait a moment for embed.js (async) and then process.
  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    if (window.instgrm?.Embeds?.process) {
      clearInterval(timer);
      window.instgrm.Embeds.process();
    } else if (tries >= 30) {
      clearInterval(timer);
      // Fallback: at least show a clickable link
      root.innerHTML = `<a href="${permalink}" target="_blank" rel="noreferrer">View on Instagram</a>`;
    }
  }, 200);
}

loadLatest();

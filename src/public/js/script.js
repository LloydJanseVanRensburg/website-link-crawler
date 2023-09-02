const submitBtn = document.querySelector("#submit-btn");
const urlInput = document.querySelector("#url");
const targetDomainInput = document.querySelector("#target-domain");
const keywordsInput = document.querySelector("#keywords");
const downloadZone = document.querySelector("#download-zone");
const notifications = document.querySelector("#notifications");

submitBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const formData = {
    url: urlInput.value,
    targetDomain: targetDomainInput.value,
    keywords: keywordsInput.value,
  };

  try {
    createNotification("info", "Processing...");

    const res = await fetch("/scrape-website", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      createNotification("error", "Something went wrong", 5000);
    }

    const { downloadLink } = await res.json();

    if (downloadLink) {
      createDownloadLink(downloadLink);
    }

    createNotification("success", "Done", 5000);
  } catch (e) {
    createNotification("error", "Something went wrong", 5000);
  }
});

function createDownloadLink(link) {
  const aTag = document.createElement("a");
  aTag.href = link;
  aTag.innerText = "Download Sheet Here";
  downloadZone.innerHTML = "";
  downloadZone.append(aTag);
}

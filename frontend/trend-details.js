

const params = new URLSearchParams(window.location.search);

const title = decodeURIComponent(params.get("title") || "");

document.getElementById("newsTitle").textContent = title;

fetch("https://echosocialai.onrender.com/summarize-news", {

    method: "POST",

    headers: {
        "Content-Type": "application/json"
    },

    body: JSON.stringify({
        news: title
    })

})

.then(response => response.json())

.then(data => {

    const text = data.summary;

    // Add this block HERE
    if (!text.includes("KEY TAKEAWAYS:")) {

        document.getElementById("summary").textContent = text;

        document.getElementById("takeaways").innerHTML =
            "<li>Not available.</li>";

        document.getElementById("opportunity").textContent =
            "Not available.";

        return;
    }

    // Existing code continues below
    const summaryPart = text.split("KEY TAKEAWAYS:")[0]
                            .replace("SUMMARY:", "")
                            .trim();

    const takeawayPart = text.split("KEY TAKEAWAYS:")[1]
                             .split("CONTENT OPPORTUNITY:")[0]
                             .trim();

    const opportunityPart = text.split("CONTENT OPPORTUNITY:")[1]
                                .trim();

    document.getElementById("summary").textContent = summaryPart;

    const takeawayList = document.getElementById("takeaways");
    takeawayList.innerHTML = "";

    takeawayPart.split("\n").forEach(item => {

        if(item.trim()){

            takeawayList.innerHTML += `<li>${item.replace("-", "").trim()}</li>`;

        }

    });

    document.getElementById("opportunity").textContent = opportunityPart;

})
.catch(error => {

    console.log(error);

    document.getElementById("summary").textContent =
    "Unable to generate summary.";

});

function openStudio(tool){

    const title =
    document.getElementById("newsTitle").textContent;


    const opportunity =
    document.getElementById("opportunity").textContent;


    window.location.href =
    `content.html?tool=${tool}&title=${encodeURIComponent(title)}&idea=${encodeURIComponent(opportunity)}`;

}
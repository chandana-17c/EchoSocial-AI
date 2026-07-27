async function loadTrendingNews() {

    const newsList = document.getElementById("news-list");

    newsList.innerHTML = "<p>Loading latest AI news...</p>";

    try {

        const response = await fetch("https://echosocial-ai.onrender.com/trends");

        const data = await response.json();

        newsList.innerHTML = "";

        data.headlines.slice(0,6).forEach(function(item) {

    newsList.innerHTML += ` 
    <div class="news-item" onclick="window.location.href='trends.html'">
        <span class="news-icon">${item.label}</span>
        <span class="news-title">${item.title}</span>
    </div>
`;

});

    } catch (error) {

        console.log(error);

        newsList.innerHTML = "<p>Unable to load latest news.</p>";

    }

}

loadTrendingNews();

document.getElementById("refreshNews").addEventListener("click", function (e) {

    e.preventDefault();

    loadTrendingNews();

});

async function loadContentIdeas(){

    const ideasBox = document.querySelector(".ideas-list");

    ideasBox.innerHTML = `
    <div class="idea-box">
        🤖 Generating AI content ideas...
    </div>
`;


    try{

        const response = await fetch(
            "https://echosocial-ai.onrender.com/content-ideas",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify({
                    niche: "Artificial Intelligence"
                })
            }
        );


        const data = await response.json();


        ideasBox.innerHTML="";


    const ideas = data.content_ideas.trim().split("\n\n");
    const dashboardIdeas = ideas.slice(0, 3);

dashboardIdeas.forEach(function(idea){

    const lines = idea.split("\n");

    const title = lines[0];

    const description = lines.slice(1).join(" ");

   ideasBox.innerHTML += `
    <div class="idea-box" onclick="window.location.href='content-ideas.html'">
        <h4>💡 ${title}</h4>
        <p>${description.slice(0,80)}...</p>
    </div>
`;

});


    }
    catch(error){

        console.log(error);

        ideasBox.innerHTML=`
<div class="idea-box">
Unable to generate ideas.
</div>
`;

    }

}


loadContentIdeas();
async function loadTrendingNews() {

    const newsList = document.getElementById("news-list");

    newsList.innerHTML = `
        <p>Loading latest AI news...</p>
    `;

    try {

        const response = await fetch("https://echosocial-ai.onrender.com/trends");

        const data = await response.json();

        newsList.innerHTML = "";

        data.headlines.forEach(function(item) {

            newsList.innerHTML += `
<div class="news-card"
onclick="openNews('${encodeURIComponent(item.title)}')">

<div class="news-label">${item.label}</div>

<h3>${item.title}</h3>

<p>
${item.summary.substring(0,150)}...
</p>

<a href="javascript:void(0)">Read More →</a>

</div>
`;

        });

    }

    catch(error) {

        console.log(error);

        newsList.innerHTML = `
            <p>Unable to load latest AI news.</p>
        `;

    }

}

loadTrendingNews();

document.getElementById("refreshNews").addEventListener("click", function(e){

    e.preventDefault();

    loadTrendingNews();

});

function openNews(title){

    window.location.href =
    `trend-details.html?title=${title}`;

}
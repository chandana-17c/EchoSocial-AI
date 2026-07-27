console.log("Content Ideas page loaded");


async function loadIdeas(){


const niche = "Artificial Intelligence";



const output =
document.getElementById("ideasContainer");



output.innerHTML =
"🤖 Generating ideas...";



try{


const response = await fetch(

"https://echosocialai.onrender.com/content-ideas",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

niche:niche

})


}

);



const data =
await response.json();



const ideas = data.content_ideas.trim().split("\n\n");

output.innerHTML = "";


ideas.forEach(function(idea){

    const lines = idea.split("\n");

    const title = lines[0];

    const description = lines.slice(1).join(" ");

    output.innerHTML += `

    <div class="idea-card">

        <h3>
        💡 ${title}
        </h3>

        <p>
        ${description}
        </p>

        <button
        class="idea-btn"
        onclick="openIdea('${encodeURIComponent(title)}','${encodeURIComponent(description)}')">

        🚀 Start Creating

        </button>

    </div>

    `;

});

}


catch(error){


console.log(error);


output.innerText =
"Unable to generate ideas.";


}


}

window.onload = loadIdeas;

function openIdea(title, description){

    window.location.href =
    `idea-workspace.html?title=${title}&description=${description}`;

}

const params = new URLSearchParams(window.location.search);


const title = decodeURIComponent(params.get("title"));

const description = decodeURIComponent(params.get("description"));


document.getElementById("ideaTitle").innerText = title;

document.getElementById("ideaDescription").innerText = description;
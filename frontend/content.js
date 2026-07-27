console.log("content.js loaded");
const params = new URLSearchParams(window.location.search);

const topic = decodeURIComponent(
    params.get("title") || ""
);

document
    .getElementById("generatePostBtn")
    .addEventListener("click", generatePost);

async function generatePost() {

    const platform =
        document.getElementById("postPlatform").value;

    const tone =
        document.getElementById("postTone").value;

    const length =
        document.getElementById("postLength").value;

    const output =
        document.getElementById("generatedPost");

    output.innerHTML =
`
<div class="loading">

🤖 AI is writing your post...

</div>
`;

    try {

        const response = await fetch(
            "https://echosocialai.onrender.com/generate-post",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    topic: topic,

                    platform: platform,

                    tone: tone,

                    length: length

                })

            }
        );

       const data = await response.json();

output.innerText = data.post;

output.scrollIntoView({

    behavior: "smooth",

    block: "center"

});

    }

    catch (error) {

        console.log(error);

        output.innerText =
            "Unable to generate post.";

    }

}

document
    .getElementById("generateThreadBtn")
    .addEventListener("click", generateThread);

async function generateThread() {

    const platform =
        document.getElementById("threadPlatform").value;

    const output =
        document.getElementById("generatedThread");

    output.innerHTML = "Generating thread...";

    try {

        const response = await fetch(
            "https://echosocialai.onrender.com/generate-thread",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    topic: topic,

                    platform: platform

                })

            }
        );

        const data = await response.json();

        output.innerText = data.thread;

        output.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

    catch (error) {

        console.log(error);

        output.innerText =
            "Unable to generate thread.";

    }

}

document
    .getElementById("analyzePostBtn")
    .addEventListener("click", analyzePost);

async function analyzePost() {

    const generatedPost =
        document.getElementById("generatedPost").innerText;

    const output =
        document.getElementById("postAnalysis");

    if (
        generatedPost.trim() === "" ||
        generatedPost === "Generated post will appear here..."
    ) {

        output.innerText =
            "Please generate a post first.";

        return;
    }

    output.innerHTML =
        "Analyzing post...";

    try {

        const response = await fetch(

            "https://echosocialai.onrender.com/analyze-post",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    post: generatedPost

                })

            }

        );

        const data = await response.json();

        output.innerText =
            data.analysis;

        output.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

    catch (error) {

        console.log(error);

        output.innerText =
            "Unable to analyze post.";

    }

}

document
    .getElementById("rewriteBtn")
    .addEventListener("click", rewritePost);

async function rewritePost() {

    const platform =
        document.getElementById("postPlatform").value;

    const output =
        document.getElementById("generatedPost");

    const currentPost =
        output.innerText;

    if (
        currentPost.trim() === "" ||
        currentPost.includes("appear here")
    ) {
        alert("Generate a post first.");
        return;
    }

    output.innerHTML =
`
<div class="loading">
🤖 AI is rewriting your post...
</div>
`;

    try {

        const response = await fetch(

            "https://echosocialai.onrender.com/rewrite-post",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    platform: platform,

                    post: currentPost

                })

            }

        );

        const data = await response.json();

        output.innerText =
            data.rewritten_post;

        output.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

    catch(error){

        console.log(error);

        output.innerText =
            "Unable to rewrite post.";

    }

}

document
.getElementById("scheduleBtn")
.addEventListener("click", function(){

    document
    .getElementById("scheduleModal")
    .style.display = "flex";

});

document
.getElementById("saveScheduleBtn")
.addEventListener("click", schedulePost);


async function schedulePost(){

    const date =
        document.getElementById("scheduleDate").value;


    const time =
        document.getElementById("scheduleTime").value;


    const platform =
document.getElementById("postPlatform").value;

const contentType =
document.getElementById("scheduleType").value;

    let content = "";

if(contentType === "post"){

    content =
    document.getElementById("generatedPost").innerText;

}
else{

    content =
    document.getElementById("generatedThread").innerText;

}

    if(
        date === "" ||
        time === ""
    ){

        alert("Please select date and time");

        return;

    }


    try{

        const response = await fetch(

            "https://echosocialai.onrender.com/schedule-post",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },


             body: JSON.stringify({

title: topic,

content: content,

platform: platform,

type: contentType,

date: date,

time: time,

status:"Scheduled"

})

            }

        );


        const data = await response.json();


        console.log(data);


        alert(
            "✅ Post scheduled successfully!"
        );
        document.getElementById("scheduleDate").value="";
        document.getElementById("scheduleTime").value=""; 

        document
        .getElementById("scheduleModal")
        .style.display="none";


    }


    catch(error){

        console.log(error);


        alert(
            "❌ Scheduling failed"
        );

    }


}

document
.getElementById("scheduleBtn")
.addEventListener("click", function(){

    const generatedPost =
    document.getElementById("generatedPost").innerText;


    if(
        generatedPost.trim()==="" ||
        generatedPost==="Generated post will appear here..."
    ){

        alert("Please generate a post first.");

        return;

    }


    document
    .getElementById("scheduleModal")
    .style.display="flex";

});

document
.getElementById("cancelScheduleBtn")
.addEventListener("click", function(){

    document
    .getElementById("scheduleModal")
    .style.display = "none";

});
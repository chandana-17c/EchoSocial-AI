console.log("Idea workspace loaded");


const params = new URLSearchParams(window.location.search);


const title = params.get("title");

const description = params.get("description");



document.getElementById("ideaTitle").innerText =
"💡 " + decodeURIComponent(title || "");



document.getElementById("ideaDescription").innerText =
decodeURIComponent(description || "");




// ===============================
// GENERATE SCRIPT
// ===============================


const scriptBtn =
document.getElementById("scriptBtn");


scriptBtn.addEventListener(
"click",
async function(){


const topic =
document.getElementById("ideaTitle").innerText;



const result =
document.getElementById("scriptResult");



result.innerHTML =
"🤖 Creating script...";



try{


const response = await fetch(

"https://echosocialai.onrender.com/script-generator",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

topic:topic,

duration:"60 seconds"

})


}

);



const data =
await response.json();



result.innerHTML = `

<h3>
🎬 Generated Script
</h3>


<p>
${data.script}
</p>

`;



}


catch(error){


console.log(error);


result.innerHTML =
"❌ Unable to generate script.";


}



});




// ===============================
// GENERATE IMAGE PROMPT
// ===============================


const imageBtn =
document.getElementById("imageBtn");



imageBtn.addEventListener(
"click",
async function(){



const styleSection =
document.getElementById("styleSection");



if(styleSection){

styleSection.style.display="block";

}



const topic =
document.getElementById("ideaTitle").innerText;



const result =
document.getElementById("imagePromptResult");



const selectedStyle =
document.querySelector(
'input[name="imageStyle"]:checked'
);



const style =
selectedStyle ?
selectedStyle.value :
"Realistic";



result.innerHTML =
"🤖 Creating image prompt...";



try{


const response = await fetch(

"https://echosocialai.onrender.com/generate-image-prompt",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

topic:topic,

style:style

})


}

);



const data =
await response.json();



result.innerHTML = `

<h3>
🎨 AI Image Prompt
</h3>


<p>
${data.image_prompt}
</p>

`;



}



catch(error){


console.log(error);



result.innerHTML =
"❌ Unable to generate image prompt";


}



});
console.log("Image Studio loaded");


const generatePromptBtn =
document.getElementById("generatePromptBtn");


const generateImageBtn =
document.getElementById("generateImageBtn");


const imageTopic =
document.getElementById("imageTopic");


const imagePrompt =
document.getElementById("imagePrompt");


const generatedImage =
document.getElementById("generatedImage");




// Generate AI Prompt
generatePromptBtn.addEventListener(
"click",
async function(){


const existingPrompt = imagePrompt.value.trim();


if(existingPrompt){

    alert("Using your existing prompt ✨");
    return;

}



const topic = imageTopic.value;


const style =
document.querySelector(
'input[name="style"]:checked'
).value;



if(!topic){
    alert("Enter image idea first!");
    return;
}



imagePrompt.value =
"🤖 Creating AI prompt...";



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



imagePrompt.value =
data.image_prompt;



}


catch(error){

console.log(error);

imagePrompt.value =
"❌ Unable to generate prompt";

}


});

// Generate Image Demo

ggenerateImageBtn.addEventListener(
"click",
function(){


generatedImage.style.display = "none";


const preview =
document.querySelector(".image-preview");


preview.innerHTML =
`
<h3>
🤖 Generating image...
</h3>
`;



setTimeout(function(){


preview.innerHTML =
`
<img
id="generatedImage"
src="images/image_studio_pic.png"
alt="Generated Image">
`;



},2000);



});
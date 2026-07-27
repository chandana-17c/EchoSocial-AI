console.log("Marketing page loaded");


const button =
document.getElementById("generateStrategyBtn");


button.addEventListener(
"click",
generateStrategy
);



async function generateStrategy(){


const business =
document.getElementById("businessInput").value;


const audience =
document.getElementById("audienceInput").value;



const result =
document.getElementById("strategyResult");



if(
business.trim()==="" ||
audience.trim()===""
){

alert("Please enter brand details");

return;

}



result.innerHTML =
"🤖 Creating marketing strategy...";



try{


const response = await fetch(

"https://echosocial-ai.onrender.com/marketing-strategy",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

business:business,

target_audience:audience

})


}

);



const data =
await response.json();



result.innerHTML =
data.strategy.replace(/\n/g,"<br>");



}



catch(error){


console.log(error);


result.innerText =
"❌ Unable to generate strategy";

}


}
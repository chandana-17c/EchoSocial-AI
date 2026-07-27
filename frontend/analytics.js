console.log("Analytics loaded");


// LOAD REAL SYSTEM METRICS

async function loadAnalytics(){

    try{

        const response = await fetch(
            "https://echosocialai.onrender.com/analytics"
        );


        const data = await response.json();


        document.getElementById("postsGenerated").innerText =
            data.total_posts;


        document.getElementById("publishedPosts").innerText =
            data.published_posts;


        document.getElementById("scheduledCount").innerText =
            data.scheduled_posts;


        document.getElementById("successRate").innerText =
            data.success_rate.toFixed(1) + "%";


    }


    catch(error){

        console.log(error);

    }

}


loadAnalytics();




// ENGAGEMENT GRAPH

const ctx = document.getElementById("engagementChart");


new Chart(ctx, {

type:"line",

data:{


labels:[
"May 27",
"May 28",
"May 29",
"May 30",
"May 31",
"Jun 01",
"Jun 02"
],


datasets:[

{

label:"Reach",

data:[
20000,
26000,
28000,
35000,
29000,
24000,
28000
],


borderColor:"#2563EB",

backgroundColor:"rgba(37,99,235,0.15)",

fill:true,

tension:0.4,

borderWidth:3,

pointRadius:5

},


{


label:"Engagement",

data:[
7000,
11000,
10000,
15000,
12000,
10000,
13000
],


borderColor:"#16A34A",

backgroundColor:"rgba(22,163,74,0.15)",

fill:true,

tension:0.4,

borderWidth:3,

pointRadius:5


},



{


label:"Clicks",

data:[
3000,
5000,
4500,
7000,
5500,
4000,
5200
],


borderColor:"#9333EA",

backgroundColor:"rgba(147,51,234,0.15)",

fill:true,

tension:0.4,

borderWidth:3,

pointRadius:5


}



]

},



options:{


responsive:true,


maintainAspectRatio:false,


interaction:{
mode:"index",
intersect:false
},


plugins:{


legend:{


position:"top"


}


},


scales:{


y:{


beginAtZero:true,


grid:{


color:"#E5E7EB"


}


},


x:{


grid:{


display:false


}


}


}



}


});
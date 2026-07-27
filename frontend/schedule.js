console.log("Schedule loaded");


const upcomingPosts =
document.getElementById("upcomingPosts");



async function loadScheduledPosts(){


try{


const response = await fetch(
"https://echosocial-ai.onrender.com/scheduled-posts"
);



const data =
await response.json();



upcomingPosts.innerHTML = "";



if(data.scheduled_posts.length === 0){

upcomingPosts.innerHTML =
`
<div class="post-card">

<h3>
No scheduled posts yet 📅
</h3>

<p>
Create a post and schedule it to see it here.
</p>

</div>
`;

return;

}



data.scheduled_posts.forEach(post=>{


const card =
document.createElement("div");


card.className =
"post-card";



card.innerHTML = `

<div class="post-left">

<i class="fa-solid fa-pen-to-square"></i>

<div>

<strong>
${post.content.substring(0,50)}...
</strong>


<p>
${post.platform} • ${post.date}
</p>


</div>

</div>


<span class="status">
${post.status}
</span>

`;



upcomingPosts.appendChild(card);



});



}


catch(error){

console.log(error);


upcomingPosts.innerHTML =
`
<div class="post-card">

<h3>
❌ Unable to load scheduled posts
</h3>

</div>
`;

}


}



loadScheduledPosts();
console.log("Theme system loaded");


// Apply saved theme when page loads

const savedTheme = localStorage.getItem("theme");


if(savedTheme === "dark"){

    document.body.classList.add("dark");

}
else{

    document.body.classList.remove("dark");

}




// Only run if settings page has theme buttons

const themeButtons = document.querySelectorAll(
    'input[name="theme"]'
);



themeButtons.forEach(button=>{


    button.addEventListener(
        "change",
        ()=>{


            const selectedTheme = button.value;



            localStorage.setItem(
                "theme",
                selectedTheme
            );



            if(selectedTheme === "dark"){


                document.body.classList.add("dark");


            }
            else{


                document.body.classList.remove("dark");


            }



        }
    );


});
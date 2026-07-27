console.log("Settings loaded");


const themeOptions = document.querySelectorAll(
    'input[name="theme"]'
);


themeOptions.forEach(option => {

    option.addEventListener("change", function(){

        if(this.value === "dark"){

            document.body.classList.add("dark-mode");

        }


        else if(this.value === "light"){

            document.body.classList.remove("dark-mode");

        }


        else if(this.value === "system"){


            if(window.matchMedia("(prefers-color-scheme: dark)").matches){

                document.body.classList.add("dark-mode");

            }

            else{

                document.body.classList.remove("dark-mode");

            }

        }


    });


});

const currentTheme =
localStorage.getItem("theme");


if(currentTheme){

document.querySelector(
`input[value="${currentTheme}"]`
).checked=true;

}
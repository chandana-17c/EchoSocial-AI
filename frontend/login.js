const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");


loginBtn.addEventListener("click", async function () {

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();


    try {

        const response = await fetch("http://127.0.0.1:8000/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })

        });


        const data = await response.json();


        if(data.success){

            alert("Login Successful!");

            localStorage.setItem(
                "username",
                data.name
            );

            window.location.href = "dashboard.html";

        }

        else{

            alert("Please enter email and password");

        }


    }

    catch(error){

        console.log(error);
        alert("Server error");

    }

});
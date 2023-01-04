const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const errorParagraph = document.querySelector('p');
    if(data.password != data.repeatPassword) {
        errorParagraph.innerText = "Hasła nie są takie same";
        return;
    }
    else{
        errorParagraph.innerText = "";
    }
    delete data.repeatPassword;
    const response = await fetch( '/api/register', { 
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if(response.ok){
        window.location = "/login";
        return;
    }
    const {error} = await response.json();
    errorParagraph.innerText = error;
})

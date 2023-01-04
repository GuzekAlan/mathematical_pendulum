const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const errorParagraph = document.querySelector('p');
    const response = await fetch( '/api/login', { 
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if(response.ok){
        window.location = "/";
        return;
    }
    const {error} = await response.json();
    errorParagraph.innerText = error;
})

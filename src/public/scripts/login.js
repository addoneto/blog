document.getElementsByTagName('form')[0].addEventListener('submit', async event => {
    event.preventDefault();

    const data = {username:document.getElementById("user").value,
            password:document.getElementById("pass").value};
    
    const req = {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify(data)
    };

    const res = await fetch('/login', req);
    if(res.status === 202) window.location.replace('/dashboard');

    try{
        const json = await res.json();
        if(json) 
            document.getElementsByTagName('pre')[0].innerText = json.message;
    }catch(err){}
});
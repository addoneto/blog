const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(form);

    const data = {
        username:formData.get('user'),
        password:formData.get('pass')
    };
    
    const req = {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body:JSON.stringify(data)
    };

    const res = await fetch('/login', req);
    if(res.status === 202) window.location.replace('/dashboard');

    try{
        const json = await res.json();
        if(json) document.getElementsByTagName('pre')[0].innerText = json.message;
    }catch(err){}
});
const postRadio = document.getElementById('postCheck');
const updateRadio = document.getElementById('updateCheck');
const passwordInput = document.getElementById('password');
const titleInput = document.getElementById('title');
const tagsInput = document.getElementById('tags');
const contentInput = document.getElementById('postContent');
const idContainer = document.getElementById('postIdContainer');

const updateInfo = `
    <input type="text" placeholder="Post ID" id="postid">
`;

//  RADIO CHECK UPDATE
updateRadio.addEventListener('change', event => {
    idContainer.innerHTML = updateInfo;
    // document.getElementById("postid").addEventListener('change', event => {
    //     if(event.code == 'Enter')
    //         fetchPostData(document.getElementById("postid").value);
    // });
});

postRadio.addEventListener('change', event => {
    idContainer.innerHTML = '';    
});

function fetchPostData(id){
    console.log(id);
}

// document.getElementById("postform").addEventListener('submit', event => {
//     event.preventDefault();

    
// });



// async function getPostInfo(){
//     const id = document.querySelector('#updateExtraInfo input').value;

    
//     const response = await fetch(`../api/article/${id}`);
//     const json = await response.json();
//     const data = json.data;

//     titleInput.value = data.title;
//     tagsInput.value = data.tags;
//     contentInput.value = data.markdownContent || data.content;
// }

// // const data = {password: passwordInput.value, id:id};
//     // const httpOptions = {
//     //     method: 'GET',
//     //     headers: {'Content-Type':'application/json'},
//     //     body: JSON.stringify(data)
//     // };

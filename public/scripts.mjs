const main = document.querySelector('main');
let temp = new Map();

const DEFAULT_POST_COLOR = "white";
const DEFAULT_TEXTBOX_COLOR = "white";
const SELECTED_POST_COLOR = "#e8e8e8";
const SELECTED_TEXTBOX_COLOR = "#f5f5f5"


/**
 * Function to determine what to do on page load. Attaches event listener to the "create post" button, and restores user's posts from the SQL database.
 */
document.addEventListener('DOMContentLoaded', function() {    
    const createButton = document.getElementById('create-post');

    //Event listener for the create post button
    createButton.addEventListener('click', createPost);
    console.log("hello");

    //Restores posts from SQL database using post request to server
    fetch("/all", {
        method: "POST",
        headers: {
            "Content-type": "application/json"
          },
        body: JSON.stringify({
            "start":"true"
        })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        for(let i = 0; i < json.length; i++){
            createPostFilled(json[i].id, json[i].title, json[i].entry, json[i].date, json[i].msid);
        }
    });

});

/**
 * Logic for clicking the right button of the two buttons on the bottom right of each post. 
 * @param {*} event Event that triggered this function
 */
function rightButtonClicked(event){
    let value = event.currentTarget.getAttribute("value");
    let post =  event.currentTarget.parentNode.parentNode;
    let header = post.querySelector('.header');
    let content = post.querySelector('.content');
    let time = post.querySelector('.time');
    let sqlid = post.querySelector('.sqlid');

    //Delete button pressed
    if(value == 0){ 
        let sqlidval = sqlid.getAttribute("value");

        //Deletes post from sql database with post request to server
        Promise.resolve(sqlidval).then((value) => {
            fetch("/delete", {
                method: "POST",
                body: JSON.stringify({
                    id: value
                }),
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((json) => {
                post.remove();
            });
        });
    }
    //Reject button pressed, while in edit mode (edit button pressed beforehand)
    else if(value == 1){

        //Switches icons to reflect leaving edit mode
        event.currentTarget.setAttribute('value', 0);
        event.currentTarget.querySelector('img').setAttribute('src', "icons/delete.png");
        event.currentTarget.parentNode.querySelector('.leftButton').setAttribute('value', 0);
        event.currentTarget.parentNode.querySelector('.leftButton').querySelector('img').setAttribute('src', "icons/edit.png");

        //Post no longer editable
        post.style.background = DEFAULT_POST_COLOR;
        header.setAttribute('contenteditable', 'false');
        content.setAttribute('contenteditable', 'false');

        //Post styling back to normal
        header.style.background = DEFAULT_TEXTBOX_COLOR;
        content.style.background = DEFAULT_TEXTBOX_COLOR;

        //Restores previous value of header and content, stored in temp
        content.innerText = temp.get(event.currentTarget.parentNode.parentNode.id)[1]
        header.innerText = temp.get(event.currentTarget.parentNode.parentNode.id)[0]
        time.innerText = temp.get(event.currentTarget.parentNode.parentNode.id)[2]
        sqlid.setAttribute("value", temp.get(event.currentTarget.parentNode.parentNode.id)[3]); 

        //Garbage removal
        temp.delete(event.currentTarget.parentNode.parentNode.id.toString());
    }
}

/**
 * Logic for clicking the left button of the two buttons on the bottom right of each post. 
 * @param {*} event Event that triggered this function
 */
function leftButtonClicked(event){
    let value = event.currentTarget.getAttribute("value");
    let post =  event.currentTarget.parentNode.parentNode;
    let header = post.querySelector('.header');
    let content = post.querySelector('.content');
    let time = post.querySelector('.time');
    let sqlid = post.querySelector('.sqlid');

    //Edit button pressed, enters edit mode
    if(value == 0){

        //Changes icons to relect switch to edit mode
        event.currentTarget.setAttribute('value', 1);
        event.currentTarget.querySelector('img').setAttribute('src', "icons/accept.png");
        event.currentTarget.parentNode.querySelector('.rightButton').setAttribute('value', 1);
        event.currentTarget.parentNode.querySelector('.rightButton').querySelector('img').setAttribute('src', "icons/reject.png");

        //Changes post styling and allows editing
        post.style.background = SELECTED_POST_COLOR;
        header.setAttribute('contenteditable', 'true');
        content.setAttribute('contenteditable', 'true');
        header.style.background = SELECTED_TEXTBOX_COLOR;
        content.style.background = SELECTED_TEXTBOX_COLOR;

        //Adds original value of content and header to temp, so it can be accessed later if user does not save
        temp.set(event.currentTarget.parentNode.parentNode.id.toString(), [header.innerText, content.innerText, time.innerText, sqlid.getAttribute("value")]);

    }
    //Accept button pressed while in edit mode
    else if(value == 1){

        //Changes icons to reflect switch out of edit mode
        event.currentTarget.setAttribute('value', 0);
        event.currentTarget.querySelector('img').setAttribute('src', "icons/edit.png");
        event.currentTarget.parentNode.querySelector('.rightButton').setAttribute('value', 0);
        event.currentTarget.parentNode.querySelector('.rightButton').querySelector('img').setAttribute('src', "icons/delete.png");

        //Reverts post styling to normal and disables editing
        post.style.background = DEFAULT_POST_COLOR;
        header.setAttribute('contenteditable', 'false');
        content.setAttribute('contenteditable', 'false');
        header.style.background = DEFAULT_TEXTBOX_COLOR;
        content.style.background = DEFAULT_TEXTBOX_COLOR;

        //Garbage cleaning
        temp.delete(event.currentTarget.parentNode.parentNode.id.toString());

        //Updates post in sql database with post request to server
        let sqlidval = sqlid.getAttribute("value");
        Promise.resolve(sqlidval).then((value) => {
            fetch("/update", {
                method: "POST",
                body: JSON.stringify({
                    header: header.innerText,
                    time: time.innerText,
                    content: content.innerText,
                    msid: post.id,
                    sqlid: value
                }),
                headers: {
                    "Content-type": "application/json"
                }
            })
            .then((response) => response.json())
            .then((json) => {
                //do nothing
            });
        });       
    }
}

/**
 * Creates a new post, on button click
 */
function createPost() {

    //5 millisecond cooldown for button
    const createButton = document.getElementById('create-post');
    createButton.disabled = true;
    setTimeout(function() {
        createButton.disabled = false;
    }, 5);

    //Create post element and add it to DOM
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.id = 'placeholder';
    postDiv.innerHTML = `
        <h2 class="header" contenteditable="false">New Post</h2>
        <p class="content" contenteditable="false">Your text here</p>
        <span class="time">Just now</span>
        <input type="hidden" class="sqlid" value="placeholder">
        <div class="flex">
            <button class="leftButton" value="0">
                <img class="buttonIcon" src="icons/edit.png" alt="edit" border="0" />
            </button>
            <button class="rightButton" value="0">
                <img class="buttonIcon" src="icons/delete.png" alt="edit" border="0" />
            </button>
        </div>
    `;
    let date = new Date();
    let monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    dateString = monthArray[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    postDiv.querySelector(".time").innerText = dateString;
    postDiv.id = Date.now().toString();
    main.appendChild(postDiv);

    //Adds event handlers to post buttons
    const leftbutton = postDiv.querySelector('.leftButton');
    leftbutton.addEventListener('click', leftButtonClicked);
    const rightbutton = postDiv.querySelector('.rightButton');
    rightbutton.addEventListener('click', rightButtonClicked);

    //Creates the post in sql database with post request
    let header = postDiv.querySelector('.header');
    let content = postDiv.querySelector('.content');
    let time = postDiv.querySelector('.time');
    fetch("/create", {
        method: "POST",
        body: JSON.stringify({
            header: header.innerText,
            time: time.innerText,
            content: content.innerText,
            msid: postDiv.id,
        }),
        headers: {
          "Content-type": "application/json"
        }
      })
        .then((response) => response.json())
        .then((json) => {
            postDiv.querySelector(".sqlid").setAttribute("value", json.sqlid);
        })
}

/**
 * 
 * @param {*} sqlid sql id
 * @param {*} header header
 * @param {*} content content
 * @param {*} time date created
 * @param {*} msid ms id
 * 
 * Creates a post with all parameters pre-filled. Useful for populating posts from database on page load.
 */
function createPostFilled(sqlid, header, content, time, msid) {

    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.id = msid;
    postDiv.innerHTML = `
        <h2 class="header" contenteditable="false">New Post</h2>
        <p class="content" contenteditable="false">Your text here</p>
        <span class="time">Just now</span>
        <input type="hidden" class="sqlid" value="placeholder">
        <div class="flex">
            <button class="leftButton" value="0">
                <img class="buttonIcon" src="icons/edit.png" alt="edit" border="0" />
            </button>
            <button class="rightButton" value="0">
                <img class="buttonIcon" src="icons/delete.png" alt="edit" border="0" />
            </button>
        </div>
    `;
    postDiv.querySelector(".time").innerText = time;
    postDiv.querySelector(".header").innerText = header;
    postDiv.querySelector(".content").innerText = content;
    postDiv.querySelector(".sqlid").setAttribute("value", sqlid);
    main.appendChild(postDiv);

    //Adds event handlers to post buttons
    const leftbutton = postDiv.querySelector('.leftButton');
    leftbutton.addEventListener('click', leftButtonClicked);
    const rightbutton = postDiv.querySelector('.rightButton');
    rightbutton.addEventListener('click', rightButtonClicked);
}
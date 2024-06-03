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
            createPostFilled(json[i].id, json[i].title, json[i].entry, json[i].date, json[i].msid, json[i].tags);
        }
    });

    // Get the tags from localStorage
	let tags = getTagsFromStorage();
	// Add each recipe to the <main> element
	addTagsToDocument(tags);

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
    let dropdownMenu = post.querySelector('.dropdownMenu');
    let tags = post.querySelector('.postTag');

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
        dropdownMenu.style.display = "block"; // show the dropdown menu

        //Adds original value of content and header to temp, so it can be accessed later if user does not save
        temp.set(event.currentTarget.parentNode.parentNode.id.toString(), [header.innerText, content.innerText, time.innerText, tags.innerText, sqlid.getAttribute("value")]);

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
        dropdownMenu.style.display = "none";

        //Garbage cleaning
        temp.delete(event.currentTarget.parentNode.parentNode.id.toString());

        console.log("Header:", header.innerText);
        console.log("Time:", time.innerText);
        console.log("Content:", content.innerText);
        console.log("Post ID:", post.id);
        console.log("Tags:", tags.innerText);
        console.log("SQL ID:", value);

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
                    tags: tags.innerText,
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
    // Note: .postTag is a stringified array, needs to initialize as '[]'
    postDiv.innerHTML = `
        <h2 class="header" contenteditable="false">New Post</h2>
        <p class="content" contenteditable="false">Your text here</p>
        <span class="time">Just now</span>
        <p class="postTag">[]</p>
        <select style="display: none;" class="dropdownMenu">Tag Toggler</select>
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
    let tags = postDiv.querySelector('.postTag');
    fetch("/create", {
        method: "POST",
        body: JSON.stringify({
            header: header.innerText,
            time: time.innerText,
            content: content.innerText,
            msid: postDiv.id,
            tags: tags.innerText,
        }),
        headers: {
          "Content-type": "application/json"
        }
      })
        .then((response) => response.json())
        .then((json) => {
            postDiv.querySelector(".sqlid").setAttribute("value", json.sqlid);
        })
    updatePostTags(); // Add the localstorage tags into the dropdown menu
    modifyPostTag(postDiv); // Add event listener to the dropdown menu
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
function createPostFilled(sqlid, header, content, time, msid, tags) {
    
    const postDiv = document.createElement('div');
    postDiv.className = 'post';
    postDiv.id = msid;
    postDiv.innerHTML = `
        <h2 class="header" contenteditable="false">New Post</h2>
        <p class="content" contenteditable="false">Your text here</p>
        <span class="time">Just now</span>
        <p class="postTag">[]</p>
        <input type="hidden" class="sqlid" value="placeholder">
        <select style="display: none;" class="dropdownMenu">Tag Toggler</select>
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
    postDiv.querySelector('.postTag').innerText = tags;

    main.appendChild(postDiv);

    //Adds event handlers to post buttons
    const leftbutton = postDiv.querySelector('.leftButton');
    leftbutton.addEventListener('click', leftButtonClicked);
    const rightbutton = postDiv.querySelector('.rightButton');
    rightbutton.addEventListener('click', rightButtonClicked);

    updatePostTags(); // Fill tags dropdown menu
    modifyPostTag(postDiv); // Add event listener to the dropdown menu
}


/**
 * Reads 'tags' from localStorage and returns an array of
 * all of the tags found (parsed, not in string form). If
 * nothing is found in localStorage for 'tags', an empty array
 * is returned.
 * @returns {Array<Object>} An array of tags found in localStorage
 */
function getTagsFromStorage() {
    const tags = localStorage.getItem('tags');
    return tags ? JSON.parse(tags) : [];
    // return tags && tags.length > 0 ? JSON.parse(tags) : [];
}

/**
 * Takes in an array of tags and for each tag creates a
 * new <tag-element> element, adds the recipe data to that card
 * using element.data = {...}, and then appends that new recipe
 * to <main>
 * @param {Array<Object>} tags An array of tags
 */
function addTagsToDocument(tags) {
    // Reference to the navigation bar
    const navRef = document.getElementById('tag-list');
    navRef.innerHTML = `
                <li><a href="#AllPosts">All Posts</a></li>
                <!-- Add Tag Button -->
                <button id="add-tag">Add Tag</button>
                <button id="clear-tags">Clear Tags</button>
        `;

    // Tag Dropdown
    let tagDropdown;
    if (tags.length > 4) {
        /*tagDropdown = document.createElement('select');
        tagDropdown.id = 'tag-dropdown';
        tagDropdown.innerHTML = '<option>More Tags</option>';*/
        tagDropdown = document.createElement('tag-dropdown');
    }

    // Loop through each of the tags in the passed in array,
    // create a <tag-element> element for each one, and populate
    // each <tag-element> with that tag data using element.data
    // Append each element to <main>
    tags.forEach((tag,index) => {
        // Create <tag-element> element
        const tagEl = document.createElement('tag-element');
        
        // Add tag button
        const addTagButton = document.getElementById('add-tag');

        // Populate tagEl with data
        tagEl.data = tag;

        // Add to navigation bar
        if (index < 4) {
            // Append each element to navigation bar
        navRef.append(tagEl);
            navRef.insertBefore(tagEl, addTagButton);
        }
        else {
            // Add dropdown at index 4
            if (index == 4) {
                navRef.insertBefore(tagDropdown,addTagButton);
            }
            /*const extraTag = document.createElement('option');
            extraTag.textContent = tag;
            tagDropdown.append(extraTag);*/
            tagDropdown.addTag(tagEl);
        }
    })

    // Add the event listeners to the button elements
	initButtonHandler();

    // Update the tags in the posts
    updatePostTags();
}

/**
 * Takes in an array of tags, converts it to a string, and then
 * saves that tag to 'tags' in localStorage
 * @param {Array<Object>} tags An array of recipes
 */
function saveTagsToStorage(tags) {
    localStorage.setItem('tags', JSON.stringify(tags));
}

/**
 * Adds the necessary event handlers to <button> and the clear storage
 * <button>.
 */
function initButtonHandler() {
	// Get a reference to the add tag button
    const addTagButton = document.getElementById('add-tag');

	// Add an event listener for the 'click' event, which fires when the
	// add tag button is clicked
    addTagButton.addEventListener("click", (event) => {
        const tagData = prompt('Enter tag name:');
        const tagEl = document.createElement('tag-element');
        tagEl.data = tagData;
        let tags = getTagsFromStorage();
        tags.push(tagData);
        localStorage.setItem('tags', JSON.stringify(tags));
        addTagsToDocument(tags);
    })

	// Get a reference to the "Clear Local Storage" button
	const clearTagsButton = document.getElementById('clear-tags');

	// Add a click event listener to clear local storage button
	clearTagsButton.addEventListener("click", (event) => {
		// Clear the local storage
		localStorage.setItem('tags', []);
		
		// Delete the contents of navigation bar except for "All Posts" and buttons
		const navRef = document.getElementById('tag-list');
		navRef.innerHTML = `
                <li><a href="#AllPosts">All Posts</a></li>
                <!-- Add Tag Button -->
                <button id="add-tag">Add Tag</button>
                <button id="clear-tags">Clear Tags</button>
        `;
        // Initialize buttons again
        initButtonHandler();
	});
}

/**
 * Updates the dropdown menu in each post with the tags from local storage
 */
function updatePostTags() {
    // console.log("in updatePostTags")
    // Get the tags from local storage
    let tagsLocal = getTagsFromStorage();
    const selects = document.querySelectorAll('.dropdownMenu');

    // For each select element
    selects.forEach(select => {
        // Clear all existing options
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }

        // Add an option for each tag
        for (const tag of tagsLocal) {
            const option = document.createElement('option');
            option.value = tag;
            option.text = tag;
            select.appendChild(option);
        }

        // Add a default option
        const defaultOption = document.createElement('option');
        defaultOption.text = 'Tag Toggler';
        defaultOption.selected = true;
        select.prepend(defaultOption); 
    });
}

/**
 * When a user selects an option in the dropdown menu, the postTag section of 
 * post will be updated
 * Note: this.options[this.selectedIndex].value feels like a hacky way to get
 * the value of the select dropdown menu.
 * @param {*} postDiv The post where we want to update the tag
 */
function modifyPostTag(postDiv) {
    // Add event listener to the dropdown menu
    const dropdownMenu = postDiv.querySelector('.dropdownMenu');
    // Overwrite that option of the dropdown menu into the postTag
    dropdownMenu.addEventListener('change', function() {
        // get the value of the selected option
        let selection = this.options[this.selectedIndex].value; 
        // get the current tags
        let tagsList = JSON.parse(postDiv.querySelector('.postTag').innerText); 
        // If the value from dropdown menu is not in the tags array, add it
        if (!tagsList.includes(selection)) {
            tagsList.push(selection);
        }
        else {
            tagsList = tagsList.filter(tag => tag !== selection);
        }
        // update the postTag section
        postDiv.querySelector('.postTag').innerText = JSON.stringify(tagsList);
        this.selectedIndex = 0; // reset dropdown menu
    });
}

/**
 * Load the tags from database and use them to update the dropdown menu
 * 
 */
// function getTagsFromData
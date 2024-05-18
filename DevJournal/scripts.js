window.addEventListener("DOMContentLoaded", init);

// Starts the program, all function calls trace back here
function init() {
    // Original Create Post Code
    const createButton = document.getElementById('create-post');
    const main = document.querySelector('main');

    // Function to create a new post
    function createPost() {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
            <h2>New Post</h2>
            <p>This is a newly created post.</p>
            <span>Just now</span>
        `;
        main.appendChild(postDiv);
    }

    // Event listener for create post button
    createButton.addEventListener('click', createPost);

	// Get the tags from localStorage
	let tags = getTagsFromStorage();
	// Add each recipe to the <main> element
	addTagsToDocument(tags);
}

/**
 * Reads 'tags' from localStorage and returns an array of
 * all of the tags found (parsed, not in string form). If
 * nothing is found in localStorage for 'recipes', an empty array
 * is returned.
 * @returns {Array<Object>} An array of tags found in localStorage
 */
function getTagsFromStorage() {
    const tags = localStorage.getItem('tags');
    return tags ? JSON.parse(tags) : [];
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
}

/**
 * Takes in an array of tags, converts it to a string, and then
 * saves that tag to 'recipes' in localStorage
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
document.addEventListener('DOMContentLoaded', function() {
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

    // Event listener for the create post button
    createButton.addEventListener('click', createPost);
});

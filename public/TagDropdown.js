class TagDropdown extends HTMLElement {
    constructor() {
        super();

        // Create elements
        let shadowEl =this.attachShadow({ mode: 'open' });

        // Dropdown container
        const container = document.createElement('div');
        container.classList.add('dropdown-container');

        // Dropdown button
        const button = document.createElement('button');
        button.classList.add('dropdown-button');
        button.textContent = 'More Tags';

        // Dropdown list
        const list = document.createElement('ul');
        list.classList.add('dropdown-list');
        list.style.display = 'none'; // Hidden by default

        // Append elements
        this.shadowRoot.append(container);
        container.append(button, list);

        // Styles
        const style = document.createElement('style');
        style.textContent = `
            .dropdown-container {
                position: relative;
                display: inline-block;
            }
            .dropdown-button {
                background-color: #fff;
                border: 1px solid #ccc;
                padding: 10px;
                cursor: pointer;
            }
            .dropdown-list {
                position: absolute;
                top: 100%;
                left: 0;
                background-color: #fff;
                border: 1px solid #ccc;
                padding: 0;
                margin: 0;
                list-style: none;
                max-height: 200px;
                overflow-y: auto;
                z-index: 1;
            }
            .dropdown-list li {
                padding: 10px;
                cursor: pointer;
            }
            .dropdown-list li:hover {
                background-color: #f0f0f0;
            }
        `;
        this.shadowRoot.append(style);

        // Toggle list visibility
        button.addEventListener('click', () => {
            list.style.display = list.style.display === 'none' ? 'block' : 'none';
        });

        // Close the dropdown if clicked outside
        document.addEventListener('click', (event) => {
            if (!this.contains(event.target)) {
                list.style.display = 'none';
            }
        });
    }

    /**
     * Adds a tag element to the dropdown list
     * @param {HTMLElement} tagElement The tag element to add
     */
    addTag(tagElement) {
        const list = this.shadowRoot.querySelector('.dropdown-list');
        const listItem = document.createElement('li');
        listItem.textContent = tagElement.data;
        list.appendChild(listItem);

        // Add click event listener to update the button text
        listItem.addEventListener('click', () => {
            this.shadowRoot.querySelector('.dropdown-button').textContent = tagElement.data;
            list.style.display = 'none';

            // window.location.hash = `#${tagName}`;
            // Toggling shows or hides the posts with matching tag
            if(toggled.has(tagElement.data)){
                toggled.delete(tagElement.data);
                listItem.style.backgroundColor = '#fff';
            }
            else{
                toggled.add(tagElement.data);
                listItem.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';

            }
            // Destory all posts
            destroyAllPosts();
            // Add posts with matching tags
            showPostsByTag(toggled);
        });

        list.appendChild(listItem);
    }
}

customElements.define('tag-dropdown', TagDropdown);

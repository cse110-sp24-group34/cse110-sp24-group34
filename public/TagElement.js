class TagElement extends HTMLElement {
    constructor() {
        super();

        // Create elements
        let shadowEl = this.attachShadow({mode: 'open'});
        const tag = document.createElement('li');
        const style = document.createElement('style');

        // Apply styles
        style.textContent = `
            li {
                padding: 0 20px;
                background-color: transparent;
            }
            li:hover {
                background-color: #fff;
            }
            
        `;

        this.shadowRoot.append(style, tag);
    }

    set data(tagName) {
        let li = this.shadowRoot.querySelector('li');
        li.textContent = tagName;
        const style = document.createElement('style');

        // Click event
        li.addEventListener('click', () => {
            // window.location.hash = `#${tagName}`;
            // Toggling shows or hides the posts with matching tag
            if(toggled.has(tagName)){
                toggled.delete(tagName);
                li.style.backgroundColor = 'transparent';
            }
            else{
                toggled.add(tagName);
                li.style.backgroundColor = 'rgba(128, 128, 128, 0.5)';

            }
            // Destory all posts
            destroyAllPosts();
            // Add posts with matching tags
            showPostsByTag(toggled);
        });
    }

    get data() {
        let li = this.shadowRoot.querySelector('li');
        return li.textContent;
    }
}

customElements.define('tag-element', TagElement);

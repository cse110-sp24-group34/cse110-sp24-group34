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
                padding: 15px;
                padding-top: 25px;
                text-align: center;
                color: white;
                background-color: darkgreen;
                padding-bottom: 20px;
                font-size: 32px;    
                border-radius: 15px;
                color: #fff;
                outline: none;
                /*T R B L*/
                position: relative;
                text-align: center;
                text-transform: none;
                width: auto;
                 margin: 0 25px;

                /* tags in between
                inbetween more tags
                */
            }
            li:hover {
                background-color: darkgreen;
                color: black;
                text-decoration: underline;
                scale: 1.15;
            }
            li:active {
            scale:1.20;
            }
            
        `;
        /*
        TAGS LIST!
        */

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

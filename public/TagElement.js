class TagElement extends HTMLElement {
    constructor() {
        super();

        //Create elements
        let shadowEl = this.attachShadow({mode: 'open'});
        const tag = document.createElement('li');
        const style = document.createElement('style');
        
        //Apply styles
        style.textContent = `
            li {
                padding: 10px;
                text-align: center;
                color: white;
                background-color: rgb(66, 133, 244);
                font-size: 20px;    
                border-radius: 15px;
                color: #fff;
                outline: none;
                position: relative;
                text-align: center;
                text-transform: none;
                width: auto;
                margin-top: 20px;
                margin-right: 10px;
            }
            li:hover {
                background-color: rgb(66, 133, 244);
                color: black;
                text-decoration: underline;
                scale: 1.15;
            }
            li:active {
                scale:1.20;
            }
        `;

        this.shadowRoot.append(style, tag);
    }

    set data(tagName) {
        let li = this.shadowRoot.querySelector('li');
        li.textContent = tagName;
        const style = document.createElement('style');

        //Click event
        li.addEventListener('click', () => {
            //Toggling shows or hides the posts with matching tag
            if(toggled.has(tagName)){
                //Tag not active
                toggled.delete(tagName);
                li.style.backgroundColor = 'rgb(66, 133, 244)';
            }
            else{
                //Tag active
                toggled.add(tagName);
                li.style.backgroundColor = 'green';
                }
            //Destory all posts
            destroyAllPosts();
            //Add posts with matching tags
            showPostsByTag(toggled);
        });
    }

    get data() {
        let li = this.shadowRoot.querySelector('li');
        return li.textContent;
    }
}

customElements.define('tag-element', TagElement);

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

        // Click event
        li.addEventListener('click', () => {
            window.location.hash = `#${tagName}`;
        });
    }

    get data() {
        let li = this.shadowRoot.querySelector('li');
        return li.textContent;
    }
}

customElements.define('tag-element', TagElement);

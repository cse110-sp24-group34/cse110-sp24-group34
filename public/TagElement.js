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

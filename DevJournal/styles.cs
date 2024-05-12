* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

body, html {
    width: 100%;
    height: 100%;
}

header {
    display: flex;
    justify-content: space-between;
    padding: 20px;
    background-color: #f4f4f4;
}

nav ul {
    list-style: none;
    display: flex;
}

nav ul li {
    padding: 0 20px;
}

nav ul li a {
    text-decoration: none;
    color: black;
}

button {
    padding: 10px;
    background-color: #007BFF;
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}

main {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
}

.post {
    border: 1px solid #ddd;
    padding: 20px;
}

.post h2 {
    margin-bottom: 10px;
}

.post p {
    color: #666;
}

.post span {
    font-size: 0.8rem;
    color: #999;
}

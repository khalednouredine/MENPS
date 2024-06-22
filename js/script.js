document.addEventListener('DOMContentLoaded', function () {
    // Authentication
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const validUsers = [
                { username: 'khalednouredine', password: 'Mhogo2.0*' },
                { username: 'rachidbekkali', password: 'Mhogo2.0*' }
            ];
            const isValidUser = validUsers.some(user => user.username === username && user.password === password);
            if (isValidUser) {
                localStorage.setItem('loggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!isLoggedIn && window.location.pathname.includes('admin.html')) {
        window.location.href = 'login.html';
    }

    // Create or update post
    const postForm = document.getElementById('post-form');
    if (postForm) {
        postForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const posts = JSON.parse(localStorage.getItem('posts')) || [];
            
            // Récupérer le fichier image
            const imageFile = document.getElementById('image').files[0];
            if (!imageFile) {
                alert('Please select an image');
                return;
            }
            
            // Convertir l'image en URL Data
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = function () {
                const image = reader.result;

                const index = postForm.dataset.index;
                if (index) {
                    posts[index] = { image, title, content };
                    delete postForm.dataset.index;
                } else {
                    // Ajouter la publication au stockage local
                    posts.push({ image, title, content });
                }
                
                localStorage.setItem('posts', JSON.stringify(posts));
                window.location.href = 'admin.html';
            };
        });
    }

    // Load posts from localStorage
    loadPosts();
});

function loadPosts() {
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        postsContainer.innerHTML = ''; // Clear existing posts
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <img style="width:100%;padding-top: 30px;padding-left: 20px;padding-right: 20px;" src="${post.image}" alt="${post.title}" class="card-img-top">
                <div class="card-body" style="direction:rtl;text-align:right;">
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                </div>
                ${localStorage.getItem('loggedIn') === 'true' ? `
                ` : ''}
            `;
            postsContainer.appendChild(postElement);
        });
    }
}
function loadPostsForIndex() {
    const postsContainer = document.getElementById('posts-container');
    if (postsContainer) {
        postsContainer.innerHTML = ''; // Clear existing posts
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <h2>${post.title}</h2>
            `;
            postsContainer.appendChild(postElement);
        });
    }
}

function editPost(index) {
    const posts = JSON.parse(localStorage.getItem('posts'));
    const post = posts[index];
    document.getElementById('image').value = post.image;
    document.getElementById('title').value = post.title;
    document.getElementById('content').value = post.content;
    document.getElementById('post-form').dataset.index = index;
}

function deletePost(index) {
    const posts = JSON.parse(localStorage.getItem('posts'));
    posts.splice(index, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPosts();
}

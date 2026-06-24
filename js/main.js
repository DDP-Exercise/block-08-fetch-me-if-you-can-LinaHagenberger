"use strict";

/*******************************************************
 *    Asynchronotrigger - 100p
 *
 *    This is your last assignment. Finish this to proof that
 *    you are a grown up now, who doesn't need to be held by
 *    the hand.
 *
 *    Create a users-class. Fetch the users, create Instances.
 *    - https://jsonplaceholder.typicode.com/users
 *
 *    Create a posts-class. Fetch the posts. create Instances.
 *    Assign them to the users (see userId in the posts).
 *    - https://jsonplaceholder.typicode.com/posts
 *
 *    Print the shit. Beautifully:
 *    List the 10 users. On click, expand them with their posts.
 *    Each Post should also have a Button to "load comments".
 *    Yes, you are correct. This is the perfect usecase for
 *    event-delegation! You can get the comments to a post from either
 *    - https://jsonplaceholder.typicode.com/posts/1/comments
 *    or
 *    - https://jsonplaceholder.typicode.com/comments?postId=1
 *    where "1" stands for the posts ID of course.
 *
 *    I believe in...
 *    You - 2026-06-09 Lina Hagenberger
 *  *******************************************************/

import User from "./class.user.js";
import Post from "./class.post.js";

let myUsers = [];
let myPosts = [];

const userContainer = document.querySelector("#userContainer");

let users = [];

function fetchUsers() {
    return fetch("https://jsonplaceholder.typicode.com/users")
        .then(response => response.json())
        .then(data => {
            for (let user of data) {
                users.push(
                    new User(user.id, user.name, user.username, user.email, user.website)
                );
            }
        });
}

function fetchPosts() {
    return fetch("https://jsonplaceholder.typicode.com/posts")
        .then(response => response.json())
        .then(data => {
            for (let postData of data) {
                let post = new Post(postData.id, postData.title, postData.body);

                let user = users.find(user => user.id === postData.userId);
                if (user) {
                    user.posts.push(post);
                }
            }
        });
}

function printUsers() {
    for (let user of users) {
        userContainer.innerHTML += user.render();
    }
}

function fetchComments(postId) {
    return fetch(`https://jsonplaceholder.typicode.com/comments?postId=1`)
        .then(response => response.json());
}

document.addEventListener("click", function(event) {
    const userElement = event.target.closest(".user");
    if (userElement && !event.target.classList.contains("load-comments")) {
        const userId = Number(userElement.dataset.userId);
        const user = users.find(user => user.id === userId);

        const postsContainer = userElement.querySelector(".posts");

        if (postsContainer.innerHTML !== "") {
            postsContainer.innerHTML = "";
            return;
        }

        for (let post of user.posts) {
            postsContainer.innerHTML += post.render();
        }
    }

    if (event.target.classList.contains("load-comments")) {
        const postElement = event.target.closest(".post");
        const postId = Number(postElement.dataset.postId);
        const commentsContainer = postElement.querySelector(".comments");

        if (commentsContainer.innerHTML !== "") {
            commentsContainer.innerHTML = "";
            return;
        }

        fetchComments(postId)
            .then(comments => {
                for (let comment of comments) {
                    commentsContainer.innerHTML += `
                        <div class="comment">
                            <h5>${comment.name}</h5>
                            <p>${comment.body}</p>
                            <small>${comment.email}</small>
                        </div>
                    `;
                }
            });
    }
});

function init() {
    fetchUsers()
        .then(() => fetchPosts())
        .then(() => printUsers())
        .catch(error => console.log(error));
}
init();



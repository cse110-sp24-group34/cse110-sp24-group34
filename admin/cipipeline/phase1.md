# Phase 1

Status of pipeline:
1keep functions simple:
- param and returns and function description
- limited characters per line
- camelCase variable naming
- no magic numbers (declare constants)
- indentations done via tabs

## What is functional

We have gone ahead and completed a small outline of our web page so that we know where things should be placed. Now that this is complete, we can start branching off and working on one small feature at a time. An example of this is the create post button, I've written it such that a placeholder block is created where the post should be, the next steps are to implement features such as editing the post, deleting the post, and adding a date to the post. After the features regarding posts are completed, we need to implement that inside of SQLite where the posts are managed through local databases so only the user can see their posts or entries.

To summarize what's written above, we have completed:
- Basic webframe
- Button to create post

## What we plan on implementing

We plan on implementing a few key features that will allow the user to have a seamless experience using our product. The features include:

- Implement features on post (edit, create, delete)
- User can create tags (dropdown appears if they create more than 4 unique tabs)
- Implement popup calendar for dates on posts 
- Implement SQLite (local posts to user only)
- CSS (make it spicy)

Our first steps are to implement important features such as grasping the post functions properly. CSS is not a priority, but something our team will constantly update as it changes the appearance of the webpage. Our most daunting task byfar is SQLite as we do not have prior knowledge on this database. We were kind enough to have Dev explain differences between MongoDB and SQLite (found in specs/adrs). We have asked Dev and he has approved us of using an import for the calendar popup we want, our project would take too long if we had to create the calendar popup as well.

## In progress
Our team has met today (5/12) and discussed our next steps. We have created issues on Github for every task and we will then assign tasks to ourselves as we see fit.

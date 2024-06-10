# ADR Checkpoint 2
Deciding on whether to include date as an editable feature
  
**Type of Meeting:**
- asynchronous chat conversation

**Attendance:**
- Abhinav
- Austin
- Derrick
- Jeffery
- Mauricio
- Neo
- Ryan
- Alex
- Can
- Sumukh

# How we decided 

We realized that changing the date attached to a post is an irrelevant feature, because:
- There are better identifiers than date, such as title and tags, when the user wants to search for a post.
- Automatically setting the date as the date of creation allows it to be a permanent and useful indicator of when a post was made.
- Controlling feature scope is important in a project with sharp time constraints, and making this decision would remove the need for a calendar tool.


# Final Decision
We came to the decision to drop user-changeable date in favor of auto-assigned creation date. The corresponding issue was removed.

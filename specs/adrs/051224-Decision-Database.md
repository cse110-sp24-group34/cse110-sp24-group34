# ADR Checkpoint 1
Deciding on what local database to use for Dev Journal
  
**Type of Meeting:**
- online, 2pm

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
We just met with our TA Dev, and he liked our pitch. We are going in the right direction with the database keeping strictly local, which is what Powell wants and Dev has approved of us using the database.

He did say that we can use certain imports such as: 
- popup calendar
- other things I forgot already (something like rendering markdown from scratch but idk if anyone else in the meeting rememebers)

Now about the databases, Dev was kind enough to explain the differences between the two we thought of and how we could use them:
**mongodb:** no relation database (don't know how to structure data, don't know how long it will be, don't know what type of data)

We can use MongoDB in ways such that we allow user to input anything into the posts, including text without a limit, images, etc

**SQLite:** relational database (databases structured in tables of data, multiple tables linked together, each table has primary and foreign key)

Ex/. Primary key is PID for example in UCSD database [unique to them], in relational db every column well defined, we know the kind of data that's going to be in there (In this scenario we know all our PIDs start with A and it's a certian length).

We can use SQLite in ways such that we set a limit of characters allowed (500 characters per post) and it's strictly like that, so nothing else like images. We would assign those in columns.

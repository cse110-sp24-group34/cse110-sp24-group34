/**
 * Main Test Suite
 * E2E tests for creating post, deleting posts, editing posts,
 *  and database persistence
 * 
 **/
describe('Basic dev use', () => {
    //Vist Site initalizatoin
    beforeAll(async () => {
      await page.goto('http://localhost:3000');
    });

    /** First Test, create a post by clicking the create button
     * 
     *  @return void
     **/
    it('Create Post', async () => {
      //refresh page to ensure database is ready
      await page.reload();

      let postCt = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      console.log(`current # of post is ${postCt}`);

      //create post
      await page.$eval('#create-post', (btn) => {
        btn.click();
      });

      //checking if posts incremented by 1
      let postCtPost = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      console.log(`Now current # of post is ${postCtPost}`);
      expect(postCt + 1).toBe(postCtPost);
    });

    /** Second test, deletes all the posts
     * 
     *  @return void
     **/
    it('Delete All Posts', async () => {
      //get current # of posts
      let postCt = await page.$$eval(".post", (posts) => {
        return posts.length;
      });

      //cycle thru all posts and clicks each delete button
      for (i=0; i < postCt; i++) {
        let postDel = await page.$eval(".rightButton", async (btnDel) => {
          //wait between each deletion to ensure database can keep up
          const delay = ms => new Promise(res => setTimeout(res, ms));
          await btnDel.click();
          await delay(500);
          return btnDel.innerHTML;
        });
        console.log(`Delete ${i}`);
      }

      //checking if all posts gone
      let postCtPost = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      expect(postCtPost).toBe(0);
    });

    /** Third test, starts w/ reload and checking if no posts left
     * then creates new posts and reloads to test database persistency
     * 
     *  @return void
     **/
    it('Reload and ensure empty, add 1 and then ensure there', async () => {
      await page.reload();

      //again wait for database to be ready
      const delay = ms => new Promise(res => setTimeout(res, ms));
      await delay(500);

      //check inital post count, should be zero after test 2
      let postCt = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      expect(postCt).toBe(0);

      await page.$eval('#create-post', (btn) => {
        btn.click();
      });

      let postCtPost = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      expect(postCtPost).toBe(1);

    });

    /** Fourth test, tests post editing functionality
     * 
     *  @return void
     **/
    it('Add title and body to post', async () => {
      let post = await page.$(".post");
      await post.$eval('.leftButton', (btn) => {
        btn.click();
      });

      //clear existing text
      await page.$eval("h2", (title) => {
        title.innerHTML = ' ';
      });
      await page.$eval("p", (title) => {
        title.innerHTML = ' ';
      });

      //type into boxes
      await page.focus("h2");
      await page.keyboard.type('Additional Text');
      await page.focus("p");
      await page.keyboard.type('Bottom Text');

      //save edits
      await post.$eval('.leftButton', (btn) => {
        btn.click();
      });

      let postTitle = await post.$eval("h2", (post) => {
        return post.innerHTML;
      });
      let postBody = await post.$eval("p", (post) => {
        return post.innerHTML;
      });

      expect(postTitle).toBe("Additional Text");
      expect(postBody).toBe("Bottom Text");
      
    });

    /** Fifth tests, tests to make sure can't edit posts w/o clicking
     * on edit first
     * 
     *  @return void
     **/
    it('Attempt to edit Title and Text without clicking edit', async () => {
      let post = await page.$(".post");

      //type without clicking edit
      await page.focus("h2");
      await page.keyboard.type('New and Improved Additional Text');
      await page.focus("p");
      await page.keyboard.type('Bottom Text 2.0');

      let postTitle = await post.$eval("h2", (post) => {
        return post.innerHTML;
      });
      let postBody = await post.$eval("p", (post) => {
        return post.innerHTML;
      });

      expect(postTitle).toBe("Additional Text");
      expect(postBody).toBe("Bottom Text");
      
    });

});
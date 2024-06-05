//Main Test Suite
describe('Basic dev use', () => {
    //Vist Site
    beforeAll(async () => {
      await page.goto('http://localhost:3000');
    });

    //First Test, create a post by clicking the create button
    it('Create Post', async () => {
      await page.reload();
      let postCt = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      console.log(`current # of post is ${postCt}`);

      //create post
      await page.$eval('#create-post', (btn) => {
        btn.click();
      });
      let postCtPost = await page.$$eval(".post", (posts) => {
        return posts.length;
      });

      expect(postCt + 1).toBe(postCtPost);
    });

    it('Delete All Posts', async () => {
      const delay = ms => new Promise(res => setTimeout(res, ms));
      
      let postCt = await page.$$eval(".post", (posts) => {
        return posts.length;
      });

      //cycle thru all posts and clicks each delete button
      for (i=0; i < postCt; i++) {
        let postDel = await page.$eval(".rightButton", async (btnDel) => {
          await btnDel.click();
          await delay(500);
          return btnDel.innerHTML;
        });
        console.log(`Delete ${i}`);
      }
      let postCtPost = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      expect(postCtPost).toBe(0);
    });

    it('Reload and ensure empty, add 1 and then ensure there', async () => {
      await page.reload();

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
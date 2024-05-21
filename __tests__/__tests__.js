describe('Basic dev use', () => {
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:3000/');
    });


    it('Create Post', async () => {
      let postCt = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      console.log(postCt)
      await page.$eval('#create-post', (btn) => {
        btn.click();
      });
      let postCtPost = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      expect(postCt + 1).toBe(postCtPost);
    });

    it('Delete All Posts', async () => {
      let postCt = await page.$$eval(".post", (posts) => {
        return posts.length;
      });
      for (i=0; i < postCt; i++) {
        let postDel = await page.$eval(".rightButton", (btnDel) => {
          btnDel.click();
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

      await page.$eval("h2", (title) => {
        title.innerHTML = ' ';
      });
      await page.$eval("p", (title) => {
        title.innerHTML = ' ';
      });
      await page.focus("h2");
      await page.keyboard.type('Additional Text');
      await page.focus("p");
      await page.keyboard.type('Bottom Text');

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
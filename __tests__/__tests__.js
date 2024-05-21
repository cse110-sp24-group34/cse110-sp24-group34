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

    /*
    it('Add title and body to post', async () => { //comebackto
      const postList = await page.$$(".post");
      let post = await postList[postList.length-1];
      await post.$eval('.leftButton', (btn) => {
        btn.click();
      });
      await post.focus("h2");
      await page.keyboard.type('test')

      post = await post.$eval("h2", (post) => {
        return post.innerHTML;
      });
      console.log(post);

      
    });
    */

    

});
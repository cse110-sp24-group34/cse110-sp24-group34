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

    

});
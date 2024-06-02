const createPost = require('../public/scripts.mjs');

describe('Unit Tests', () => {
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

        createPost();
        postCt = await page.$$eval(".post", (posts) => {
            return posts.length;
          });
        expect(postCt).toBe(2);
    });
});
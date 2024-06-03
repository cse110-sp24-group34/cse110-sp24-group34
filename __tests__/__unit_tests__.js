describe('Unit Tests', () => {

    beforeAll(async () => {
        await page.goto('http://localhost:3000');
    });

    it('Create Post', async () => {
        await page.reload();
        let postCt = await page.$$eval(".post", (posts) => {
            return posts.length;
        });
        console.log(`current # of post is ${postCt}`);

        await page.evaluate(() => {

            createPost();
        });

        postCt = await page.$$eval(".post", (posts) => {
            return posts.length;
        });
        expect(postCt).toBe(2);
    });
});

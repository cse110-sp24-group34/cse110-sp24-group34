beforeAll(async () => {
    await page.goto('http://localhost:3000');
});

it('Create Post', async () => {
    await page.reload();
    let initialPostCount = await page.$$eval(".post", posts => posts.length);

    await page.evaluate(() => {
        createPost();
    });

    await page.waitForSelector('.post');

    let finalPostCount = await page.$$eval(".post", posts => posts.length);

    expect(finalPostCount).toBe(initialPostCount + 1);
});

it('Edit Post', async () => {
    await page.click('#create-post');
    await page.waitForSelector('.post');
    await page.click('.post .leftButton');
    await page.waitForFunction(() => {
        const post = document.querySelector('.post');
        return post && post.style.background === 'rgb(232, 232, 232)';
    });
    const postEditMode = await page.$eval('.post', post => post.style.background === 'rgb(232, 232, 232)');
    expect(postEditMode).toBe(true);
});

it('Delete Post', async () => {
    await page.click('#create-post');
    await page.waitForSelector('.post');
    await page.click('.post .rightButton');

    await page.waitForSelector('.post', { hidden: true, timeout: 5000 }); 
});

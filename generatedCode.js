
const isBlocked = blockedUrls.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(details.url);
});
console.log(isBlocked);

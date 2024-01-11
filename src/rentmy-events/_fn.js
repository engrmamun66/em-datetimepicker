export const usingPages = (keys = []) => {
    let usingPages = [];
    keys?.forEach(key => {
        let pages = RENTMY_GLOBAL.page;
        if (pages[key]) {
            let page = {}
            page.url = pages[key]
            page.name = pages[key]?.split(window.location.origin)?.[1]
            usingPages.push(page)
        }
    })
    return usingPages;
}
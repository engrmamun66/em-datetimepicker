async function labelToSelectorAll(selectors, searchFromElement=null) {
    if(selectors) {

        let selector_list = [];
        for (const key in selectors) {
            if (selectors.hasOwnProperty(key)) {
                const selector = selectors[key];
                if(selector.includes('[') || selector.includes(']')) {
                    selector_list.push(selector.replace('[','').replace(']',''))
                }
            }
        }

        let Elements = searchFromElement ?  Array.from(searchFromElement.querySelectorAll('*')) : Array.from(document.querySelectorAll('*'));

        Elements.forEach(element => {
            let excludedTag = ['HTML', 'TITLE', 'META', 'HEAD', 'STYLE', 'BODY', 'LINK', 'SCRIPT'];
            if(excludedTag.includes(element.tagName) === false) { 
                let text = element?.textContent;
                let startBrace = text.match(/{{/g)?.length;
                let endBrace = text.match(/}}/g)?.length;
                let children = element.children?.length;
                if(children === 0 && startBrace === 1 && endBrace === 1){   
                    let label_text = text.replace(/\s/g, "").replace('{{','').replace('}}','');
                    if (selector_list.includes(label_text)) {
                        element.setAttribute(label_text,'true');
                        element.textContent = '';
                    }
                }
            }
        })
    }
    
}

function getQuerySelectAll(selector, searchFromElement=null) {
    if(selector) {
        const elements = searchFromElement ?  Array.from(searchFromElement.querySelectorAll(selector)) : Array.from(document.querySelectorAll(selector));
        if(elements?.length) return elements
    }
    return []
}


async function createSelectorFromArray(selectors = []) {
    let selectorsObj = {}
    selectors.forEach((selector)=>{
        selectorsObj[selector] = `[${selector}]`
    })
    return selectorsObj
}

async function updateImage(selector, url) {
    if(selector && url) {
        const images = document.querySelectorAll(selector);
        images.forEach((image)=>{
            image.src = url;
        })
    }
}


async function formSelector() {
    var form = document.getElementById('renmy-customer-edit-form');
    let submitBtn = document.getElementById('renmy-customer-edit-submit');
    let form_data = {}
    if(submitBtn) {
        submitBtn.addEventListener('click', ()=>{
            var data = new FormData(form);
            for (var [key, value] of data) {
                form_data[key] =value
            }
        })
    }

    let rentmy_country = document.getElementById("rentmy_country")
    if(rentmy_country) {
        var option= document.createElement("option")
        option.value= "JavaScript";
        option.text= "JavaScript";
        rentmy_country.add(option);
    }

    let cancelBtn = document.getElementById('renmy-customer-edit-cancel');
    if(cancelBtn) {
        cancelBtn.addEventListener('click', ()=>{
            form.hidden = true;
            setTimeout(() => {
                form.hidden = false;
            }, 1000);
        })
    }

}

export default {
    labelToSelectorAll,
    updateImage,
    createSelectorFromArray,
    getQuerySelectAll
}

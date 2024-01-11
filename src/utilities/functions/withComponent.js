export function createComponentHTML(DomElement, options, isChild=false) {        
    // options = [
    //     {
    //         selector: 'p', // pass '__SELF__' (use in child[], see example in File: src/pages/OrderComplete.vue:219)
    //         template: true,
    //         attr: {
    //             'v-if': 'person.idd == 0'
    //         },
    //         text: "{{ 'Administrator' }}",
    //         removeSiblings: false, //optional
    //         classToRemove: '', //optional
    //         skipIcon: false, //optional
    //         removeAttr: ['placeholder'] //optional
    //         target: { prev_tag, next_tag, parent_tag, child_tag }, // when we want to select a TEXT_NODE
    //         child: [] ------- child is the same type of options(calling recusively), example in file: src\modules\checkout\views\GenerateCompoenentHtml.js:883
    //         console: true //optional ---- to console current selctor and element
    //     },
    // ]
    if(!DomElement) return;
    let element = DomElement;
    try {
        let templates = [];
        options?.forEach((option, index) => {
            if(!option.attr) option.attr = {};
            try {             
                let el = element;
                if(option?.selector !=='__SELF__'){
                    if(index > 0 || option?.selector){
            
                        el = element?.querySelector(option?.selector) || element?.content?.querySelector(option?.selector);
                        
                        // Finding from all templates
                        templates.forEach(template => {
                            let _el = template.content.querySelectorAll(option.selector);
                            if(_el?.length){
                                if(_el) el = _el[_el.length - 1];   
                            }
                        })
                        
                    }
                }
                

                if(option.console === true){
                    window.globalElement = el;
                    console.log(option.selector, el);
                    console.log('outerHTML', el?.outerHTML || el?.content?.firstChild?.outerHTML || '__notFoundOuterHTML__');
                }
                                    
                if (el && Object.keys(option.attr || {})?.length) {
                    if (option.template) {
                        if(option.removeSiblings){
                            while(el.nextSibling){
                                el.nextSibling.remove()
                            }
                        }
                        let template
                        let clonedEl                  

                        template = document.createElement('template');
                        if('v-else-if' in option.attr || 'v-else' in option.attr){ 
                            let last_template = templates[templates.length  - 1]  
                            clonedEl = el.cloneNode(true);
                            clearVueAttributes(clonedEl); 
                            clearAttributes(clonedEl, option?.removeAttr);                
                            template.content.appendChild(clonedEl);
                            last_template.insertAdjacentElement('afterend', template);                        
                        }else{
                            let clonedEl = el.cloneNode(true);  
                            clearAttributes(clonedEl, option?.removeAttr);                        
                            template.content.appendChild(el.cloneNode(true));
                            el.insertAdjacentElement('beforebegin', template);
                            el.remove();
                        }
                        templates.push(template);
                        el = template;          
                        
                        Object.entries(option.attr).forEach(entry => {
                            let [key, value] = entry;
                            key = key.replace(/^@/, "v-on:");
                            autoClearAttributes(el, key);
                            value = key=='v-else' ? '' : value;
                            el.setAttribute(key, value);                                                  
                        })

                        if(option.classToRemove){
                            el.classList.remove(option.classToRemove)
                        } 
                    } else {

                        Object.entries(option.attr).forEach(entry => {
                            let [key, value] = entry;
                            key = key.replace(/^@/, "v-on:");
                            value = key=='v-else' ? '' : value;
                            el.setAttribute(key, value);
                        })

                        clearAttributes(el, option?.removeAttr);
                        
                        if(option.classToRemove){
                            el.classList.remove(option.classToRemove)
                        }

                        Object.entries(option.attr).forEach(entry => {
                            let [key, value] = entry;
                            key = key.replace(/^@/, "v-on:");
                            autoClearAttributes(el, key);
                            value = key=='v-else' ? '' : value;
                            el.setAttribute(key, value);                                                  
                        })

                        if(option.removeSiblings){
                            while(el.nextSibling){
                                el.nextSibling.remove()
                            }
                        }
                    }
                }

                if (el && option.text) {
                    if(el.content) el = el.content.firstChild; 
                    // Avoid assiging any text or html when found ByElementor attribute
                    if(!el.hasAttribute('ByElementor')){
                        if(option.target){
                            let textNode = getExactTextNode(el, option.target);
                            if(textNode){
                                textNode.textContent = option.text;
                            }
                        } else { 
                            let innerHTML = null;
                            innerHTML = el.innerHTML;
                            innerHTML = el.innerHTML?.replace(/\s{2,}/g, "");
    
                            let pre_icon_html = '';
                            let post_icon_html = ''
                            if (option?.skipIcon !== true && el.querySelector('i')) {
                                let hasIconInLeft = (/i>.*[a-z]+/i).test(innerHTML);
                                let hasIconInRight = (/[a-z]+\s?<i/i).test(innerHTML);
                                if (hasIconInLeft) pre_icon_html = el.querySelector('i').outerHTML;
                                if (hasIconInRight) post_icon_html = el.querySelector('i').outerHTML;
                            }
                            el.innerHTML = `${pre_icon_html} ${option.text} ${post_icon_html}`;
                        }
                    }                
                }
                
                if(el && option.child){
                    createComponentHTML(el?.content?.firstChild || el, option.child, true);
                }
                               
            } catch(error) {
               console.warn(error); 
            }
        });
        
    } catch (error) {
        console.warn(error);
    }
}



function clearVueAttributes(domElement) {
    if (domElement && domElement.attributes) {
      for(let i=domElement.attributes.length-1; i >= 0; i--) {
        let attributeName = domElement.attributes[i].name
        var htmlAttributes = [
            'class', 'id', 'title', 'disabled', 'hidden', 'contenteditable',
            'name', 'value', 'placeholder', 'type', 'href', 'src', 'alt',
            'style', 'target', 'rel', 'width', 'height', 'maxlength', 'min',
            'max', 'step', 'for', 'tabindex', 'readonly', 'required', 'autofocus',
            'aria-label', 'role', 'aria-hidden', 'aria-disabled', 'aria-selected',
            'aria-checked', 'aria-describedby', 'aria-labelledby', 'aria-controls'
            // Add more attributes here as needed
        ];
        if(!htmlAttributes.includes(attributeName)){
            domElement.removeAttribute(attributeName);
        }
      }
    }
}

function clearAttributes(domElement, attr_array=[]) {
    if (domElement && attr_array) {        
        attr_array?.forEach(attr => domElement.removeAttribute(attr));      
    }
}

function autoClearAttributes(el, key) {
    if(key.startsWith(":") || key.startsWith("v-bind:")){
        if(key != 'v-bind'){
            let _key = key.split(":")[1];
            if(!['class', 'style'].includes(_key)){
                // Example: if pass :src, then remove src attribute first
                el.removeAttribute(key.split(":")[1]);
            }
        }
    }
}

function getAllTextNodes(element) {
    const textNodes = [];
    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const childNode of node.childNodes) {
                traverse(childNode);
            }
        }
    }
    traverse(element || document.body);
    return textNodes;
}

function getExactTextNode(element, target={}/** option.target */){
    try {
        Object.keys(target).forEach(key => target[key] = target[key].toLocaleUpperCase());    
        let textNode = getAllTextNodes(element)
        ?.filter(el => {
            let prev_tag = el.previousSibling?.tagName ?? null;
            let next_tag = el.nextSibling?.tagName ?? null;

            let parent_tag = el.parentElement?.tagName ?? null;
            let child_tag = el.firstChild?.tagName ?? null;
            
           if(target.prev_tag && target.next_tag){
                return (target.prev_tag == prev_tag && target.next_tag == next_tag)
            }
            else if(target.parent_tag && target.child_tag){
                return (target.parent_tag == parent_tag && target.child_tag == child_tag)
            }
            else if(target.prev_tag){
                return (target.prev_tag == prev_tag)
            }
            else if(target.next_tag){
                return (target.next_tag == next_tag)
            }
            else if(target.parent_tag){
                return (target.parent_tag == parent_tag)
            }
            else if(target.child_tag){
                return (target.child_tag == child_tag)
            }         
        
            return false;
        })        
        return textNode?.[0] ?? null;
    } catch (error) {
        console.warn(error);
    }
}



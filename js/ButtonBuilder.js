
var buttonGroups = {};
const clickEvent = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true
});
// Flux store Singleton way
export default Object.assign({}, {
    pushButton (buttonName, onClick) {
        let element = document.querySelector(`.js-button-${buttonName}`);
        if (element && onClick) {
            element.addEventListener('click', async (event) => {
                if (!element.classList.contains("busy")) {
                    element.classList.add("busy");
                    await onClick(buttonName, event, element);
                    element.classList.remove("busy");
                }
            });
        }
    },
    toggleButton (buttonName, actions) {
        let element = document.querySelector(`.js-button-${buttonName}`);
        if (element) {
            element.addEventListener('click', async (event) => {
                
                if (!element.classList.contains("busy")) {
                    element.classList.add("busy");

                    if (element.classList.contains("active") && actions.off) {
                        await actions.off(buttonName, event, element);
                    } else if (actions.on) {
                        await actions.on(buttonName, event, element);
                    }
                    if (actions.click) {
                        await actions.click(buttonName, event, element);
                    }
                    element.classList.toggle("active");
                    element.classList.remove("busy");
                }
            });
        }
    },
    groupedButton (buttonName, groupName, onClick, startActive) {
        let element = document.querySelector(`.js-button-${buttonName}`);
        if (element) {
            if (!buttonGroups[groupName]) buttonGroups[groupName] = {};
            buttonGroups[groupName][buttonName] = startActive;
            element.addEventListener('click', async (event) => {
                
                if (!element.classList.contains("busy")) {
                    element.classList.add("busy");
                    for (const name in buttonGroups[groupName]) {
                        let other = document.querySelector(`.js-button-${name}`);
                        other.classList.remove("active");                    
                    }
                    if (onClick) {
                        await onClick(buttonName, event, element);
                    }
                    element.classList.toggle("active");
                    element.classList.remove("busy");
                }
            });
        }
    },
    click (buttonName) {
        let element = document.querySelector(`.js-button-${buttonName}`);
        element.dispatchEvent(clickEvent);
    }
  });

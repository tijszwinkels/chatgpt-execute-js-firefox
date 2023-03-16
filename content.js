function addButtonToCodeBlocks() {
  const codeBlockContainers = document.querySelectorAll("pre:not(.executeCodeAdded)");

  codeBlockContainers.forEach((container) => {
    // Add the button
    container.classList.add("executeCodeAdded");
    const executeButton = document.createElement("button");
    
    const playIconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-1 inline-block">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>`;
    
    executeButton.innerHTML = playIconSvg + "Execute Code";
    executeButton.classList.add("executeCodeButton");
    executeButton.style.marginLeft = "8px";
    executeButton.style.display = "flex";
    executeButton.style.alignItems = "center";

    // Handle clicks
    executeButton.addEventListener("click", async () => {
      const codeBlock = container.querySelector("code");
      const code = codeBlock.innerText;
      let result;

      try {
        let ASYNC_EVAL = null;
        result = "output: " + eval(code);
        if (ASYNC_EVAL) {
          result += `\nASYNC_EVAL resolved output: ${await ASYNC_EVAL}`;
        }
        result += "\nPlease explain these results to me."
      } catch (error) {
        result = "error: " + error.toString();
        result += "\n\nCould you fix this?";
      }

      const inputBox = document.querySelector("textarea");
      inputBox.value += `\n${result}`;
      inputBox.dispatchEvent(new Event('input', { bubbles: true })); // Refresh input box
    });

    const copyButton = container.querySelector("button");
    copyButton.insertAdjacentElement("afterend", executeButton);
  });
}

// Initial run
addButtonToCodeBlocks();

// Observe DOM changes for new code blocks
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList" || mutation.type === "subtree") {
      addButtonToCodeBlocks();
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});


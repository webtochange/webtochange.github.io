let documentationData = {
};

let currentActiveSection = null;

const docTitle = document.getElementById('doc-title');
const docDescription = document.getElementById('doc-description');
const chaptersList = document.getElementById('chapters-list');
const contentTitle = document.getElementById('content-title');
const contentArea = document.getElementById('content-area');

function initializeDocumentation() {
    console.log('Initializing documentation...');
    
    docTitle.textContent = documentationData.title;
    docDescription.textContent = documentationData.description;
    
    renderNavigation();
    
    console.log('Documentation initialized successfully');
}

function renderNavigation() {
    chaptersList.innerHTML = '';
    
    documentationData.chapters.forEach((chapter, chapterIndex) => {
        const chapterItem = document.createElement('li');
        chapterItem.className = 'chapter-item';
        
        const chapterButton = document.createElement('button');
        chapterButton.className = 'chapter-title';
        chapterButton.textContent = chapter.title;
        chapterButton.onclick = () => toggleChapter(chapterIndex);
        
        const sectionsList = document.createElement('ul');
        sectionsList.className = 'sections-list';
        sectionsList.style.display = 'block';
        
        chapter.sections.forEach((section, sectionIndex) => {
            const sectionItem = document.createElement('li');
            sectionItem.className = 'section-item';
            
            const sectionLink = document.createElement('a');
            sectionLink.className = 'section-link';
            sectionLink.textContent = section.heading;
            sectionLink.href = '#';
            sectionLink.onclick = (e) => {
                e.preventDefault();
                displaySection(chapterIndex, sectionIndex);
            };
            
            sectionItem.appendChild(sectionLink);
            sectionsList.appendChild(sectionItem);
        });
        
        chapterItem.appendChild(chapterButton);
        chapterItem.appendChild(sectionsList);
        chaptersList.appendChild(chapterItem);
    });
}

function toggleChapter(chapterIndex) {
    const chapterItem = chaptersList.children[chapterIndex];
    const sectionsList = chapterItem.querySelector('.sections-list');
    
    if (sectionsList.style.display === 'none') {
        sectionsList.style.display = 'block';
    } else {
        sectionsList.style.display = 'none';
    }
}

function displaySection(chapterIndex, sectionIndex) {
    const section = documentationData.chapters[chapterIndex].sections[sectionIndex];
    
    if (currentActiveSection) {
        currentActiveSection.classList.remove('active');
    }
    
    const newActiveSection = chaptersList
        .children[chapterIndex]
        .querySelector('.sections-list')
        .children[sectionIndex]
        .querySelector('.section-link');
    
    newActiveSection.classList.add('active');
    currentActiveSection = newActiveSection;
    
    contentTitle.textContent = section.heading;
    
    const sectionContent = document.createElement('div');
    sectionContent.className = 'section-content';
    
    const heading = document.createElement('h3');
    heading.textContent = section.heading;
    sectionContent.appendChild(heading);

    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = section.content;
    sectionContent.appendChild(contentParagraph);
    
    if (section.code) {
        const codeBlock = createCodeBlock('Code', section.code.language, section.code.content);
        sectionContent.appendChild(codeBlock);
    }

    if (section.example) {
        const exampleBlock = createExampleBlock(
            section.example.description,
            section.example.language,
            section.example.content
        );
        sectionContent.appendChild(exampleBlock);
    }
    
    contentArea.innerHTML = '';
    contentArea.appendChild(sectionContent);
    
    if (window.Prism) {
        Prism.highlightAllUnder(sectionContent);
    }
}

function createCodeBlock(title, language, content) {
    const codeBlock = document.createElement('div');
    codeBlock.className = 'code-block';
    
    const header = document.createElement('div');
    header.className = 'code-header';
    header.textContent = title;

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = getCopyIcon();
    copyButton.title = 'Kopiuj kod';
    copyButton.onclick = () => {
        navigator.clipboard.writeText(content).then(() => {
            copyButton.innerHTML = getCheckIcon();
            setTimeout(() => {
                copyButton.innerHTML = getCopyIcon();
            }, 1500);
        });
    };
    header.appendChild(copyButton);
    
    const codeContent = document.createElement('div');
    codeContent.className = 'code-content';
    
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = `language-${language}`;
    code.textContent = content;
    
    pre.appendChild(code);
    codeContent.appendChild(pre);
    
    codeBlock.appendChild(header);
    codeBlock.appendChild(codeContent);
    
    return codeBlock;
}

function createExampleBlock(description, language, content) {
    const exampleBlock = document.createElement('div');
    exampleBlock.className = 'example-block';
    
    const header = document.createElement('div');
    header.className = 'example-header';
    header.textContent = 'Example';

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.innerHTML = getCopyIcon();
    copyButton.title = 'Kopiuj kod';
    copyButton.onclick = () => {
        navigator.clipboard.writeText(content).then(() => {
            copyButton.innerHTML = getCheckIcon();
            setTimeout(() => {
                copyButton.innerHTML = getCopyIcon();
            }, 1500);
        });
    };
    header.appendChild(copyButton);
    
    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'example-description';
    descriptionDiv.textContent = description;
    
    const codeContent = document.createElement('div');
    codeContent.className = 'example-code';
    
    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = `language-${language}`;
    code.textContent = content;
    
    pre.appendChild(code);
    codeContent.appendChild(pre);
    
    exampleBlock.appendChild(header);
    exampleBlock.appendChild(descriptionDiv);
    exampleBlock.appendChild(codeContent);
    
    return exampleBlock;
}

document.addEventListener('DOMContentLoaded', () => {
    initializeDocumentation();
    displaySection(0, 0);
});

function getCopyIcon() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
    </svg>
    `;
}

function getCheckIcon() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708 0z"/>
    </svg>
    `;
}
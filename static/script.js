document.addEventListener("DOMContentLoaded", () => {
    const resultDiv = document.getElementById("result");

    // Initialize "Reject All" button - initially hidden
    const rejectAllBtn = document.createElement("button");
    rejectAllBtn.className = "reject-all-btn btn btn-warning";
    rejectAllBtn.textContent = "Alles Afwijzen";
    rejectAllBtn.style.display = "none"; // Initially hidden
    resultDiv.appendChild(rejectAllBtn);

    // Initialize "Copy" button - initially disabled
    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-btn btn btn-primary";
    copyBtn.textContent = "Kopiëren";
    copyBtn.disabled = true; // Initially disabled
    resultDiv.appendChild(copyBtn);
    
    const slider = document.getElementById("slider");
    const sliderValue = document.getElementById("sliderValue");

    slider.addEventListener("input", () => {
        sliderValue.textContent = slider.value + "%";
    });

    document.getElementById("sentenceForm").addEventListener("submit", async (event) => {
        event.preventDefault();

        const textInput = document.getElementById("textInput");
        const text = textInput.value;
        const loadingMessages = document.getElementById("loadingMessages");
        loadingMessages.innerHTML = ""; // Clear previous messages
        loadingMessages.style.display = "block"; // Show the loading messages div

        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = "";
        loadingMessages.style.display = "none"; // Hide the loading messages div after loading

        const rejectAllBtn = document.createElement("button");
        rejectAllBtn.className = "reject-all-btn btn btn-warning";
        rejectAllBtn.textContent = "Alles Afwijzen";
        rejectAllBtn.addEventListener("click", () => {
            const improvedSentenceElems = document.querySelectorAll(".improved-sentence");
            const acceptBtns = document.querySelectorAll(".accept-btn");
            const rejectBtns = document.querySelectorAll(".reject-btn");

            improvedSentenceElems.forEach(elem => elem.remove());
            acceptBtns.forEach(btn => btn.remove());
            rejectBtns.forEach(btn => btn.remove());

            const originalSentenceElems = document.querySelectorAll(".original-sentence");
            originalSentenceElems.forEach(elem => {
                elem.style.fontWeight = "normal";
                elem.style.fontStyle = "normal";
            });

            copyBtn.disabled = false;
        });

        resultDiv.appendChild(rejectAllBtn);

        // Append "Copy" button after "Reject All" button and before appending sentences
        const copyBtn = document.createElement("button");
        copyBtn.className = "copy-btn btn btn-primary";
        copyBtn.textContent = "Kopiëren";
        copyBtn.disabled = true; // Initially disabled
        copyBtn.addEventListener("click", () => {
            const sentences = Array.from(document.querySelectorAll(".original-sentence")).map(elem => elem.textContent);
            navigator.clipboard.writeText(sentences.join(" "));
        });

        resultDiv.appendChild(copyBtn);

        async function updateLoadingMessage(message) {
            const messageElem = document.createElement("p");
            messageElem.textContent = message;
            loadingMessages.appendChild(messageElem);
            await new Promise(resolve => setTimeout(resolve, 0)); // Wait for the next event loop
        }

        // Usage:
        try {
            await updateLoadingMessage("Informatie verzenden...");
        } catch (error) {
            console.error("Fout bij het bijwerken van het laadberichtje:", error);
        }

        const useCaseCheckboxes = document.querySelectorAll('input[name="use_case"]:checked');
        const selectedUseCases = Array.from(useCaseCheckboxes).map(checkbox => checkbox.value);

        const response = await Promise.race([
            fetch("/improve_sentences", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({ text, slider: slider.value, use_cases: selectedUseCases.join(',') }),
            }),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), 30000)) // Timeout after 30 seconds
        ]).catch(async (err) => {
            await updateLoadingMessage("Fout: " + err.message);
            throw err;
        });

        try {
            updateLoadingMessage("Verbeteringen schrijven...");
        } catch (error) {
            console.error("Fout bij het bijwerken van het laadberichtje:", error);
        }

        const { originalSentences: originalSentencesFromResponse, improvedSentences } = await response.json().catch(error => console.error("Error parsing JSON:", error));

        try {
            updateLoadingMessage("Verbeterde zinnen instellen...");
        } catch (error) {
            console.error("Fout bij het bijwerken van het laadberichtje:", error);
        }

        loadingMessages.style.display = "none"; // Hide the loading messages div after loading

        for (let i = 1; i <= Object.keys(originalSentencesFromResponse).length; i++) {
            const sentenceKey = `sentence${i}`;
            const originalSentence = originalSentencesFromResponse[sentenceKey];
            const improvedSentence = improvedSentences ? improvedSentences[sentenceKey] : null;

            const sentenceElem = document.createElement("p");
            sentenceElem.className = "original-sentence";
            sentenceElem.textContent = originalSentence;

            if (improvedSentence) {
                sentenceElem.style.fontWeight = "bold";
                sentenceElem.style.fontStyle = "italic";
            } else {
                sentenceElem.style.fontWeight = "normal";
                sentenceElem.style.fontStyle = "normal";
            }

            resultDiv.appendChild(sentenceElem);

            if (improvedSentence) {
                const improvedSentenceElem = document.createElement("p");
                improvedSentenceElem.className = "improved-sentence";
                improvedSentenceElem.textContent = improvedSentence;

                const acceptBtn = document.createElement("button");
                acceptBtn.className = "accept-btn btn btn-success";
                acceptBtn.textContent = "Accepteren";
                acceptBtn.addEventListener("click", () => {
                    sentenceElem.textContent = improvedSentence;
                    sentenceElem.style.fontWeight = "normal";
                    sentenceElem.style.fontStyle = "normal";
                    improvedSentenceElem.remove();
                    acceptBtn.remove();
                    rejectBtn.remove();

                    const pendingSentences = document.querySelectorAll(".improved-sentence").length;
                    copyBtn.disabled = pendingSentences > 0;
                });

                const rejectBtn = document.createElement("button");
                rejectBtn.className = "reject-btn btn btn-danger";
                rejectBtn.textContent = "Afwijzen";
                rejectBtn.addEventListener("click", () => {
                    sentenceElem.style.fontWeight = "normal";
                    sentenceElem.style.fontStyle = "normal";
                    improvedSentenceElem.remove();
                    acceptBtn.remove();
                    rejectBtn.remove();
        
                    // Check if there are any improved sentences left
                    const pendingSentences = document.querySelectorAll(".improved-sentence").length;
                    // If there are no more improved sentences, enable the "Copy" button
                    copyBtn.disabled = pendingSentences > 0;
        
                    // If using the "Reject All" button, ensure it's hidden when there are no sentences to reject
                    if (pendingSentences === 0) {
                        rejectAllBtn.style.display = "none";
                    }
                });

                resultDiv.appendChild(improvedSentenceElem);
                resultDiv.appendChild(acceptBtn);
                resultDiv.appendChild(rejectBtn);
            }
        }
        rejectAllBtn.style.display = "block"; // Show the "Reject All" button
        copyBtn.disabled = false; // Enable the "Copy" button if there are improvements
    });
});
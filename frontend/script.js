async function checkURL() {
    let url = document.getElementById("urlInput").value;
    let loader = document.getElementById("loader");
    let resultBox = document.getElementById("resultBox");
    let resultText = document.getElementById("resultText");
    let confidenceText = document.getElementById("confidence");
    let reasonsList = document.getElementById("reasons");

    if (!url) {
        alert("Enter URL");
        return;
    }

    loader.classList.remove("hidden");
    resultBox.classList.add("hidden");

    try {
        let response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        });

        let data = await response.json();

        loader.classList.add("hidden");
        resultBox.classList.remove("hidden");

        // Result
        if (data.result === "Phishing") {
            resultText.innerHTML = "⚠️ Phishing Website";
            resultBox.style.borderLeft = "5px solid red";
        } else {
            resultText.innerHTML = "✅ Legitimate Website";
            resultBox.style.borderLeft = "5px solid green";
        }

        // Confidence
        confidenceText.innerHTML = "Confidence: " + data.confidence + "%";

        // Reasons
        reasonsList.innerHTML = "";
        data.reasons.forEach(reason => {
            let li = document.createElement("li");
            li.textContent = reason;
            reasonsList.appendChild(li);
        });

    } catch (error) {
        loader.classList.add("hidden");
        alert("Error connecting backend");
    }
}
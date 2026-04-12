// 🔥 LOAD HISTORY FUNCTION (OUTSIDE)
async function loadHistory() {
    try {
        const response = await fetch("https://phishing-detector-isr5.onrender.com/history");
        const data = await response.json();

        const list = document.getElementById("historyList");
        list.innerHTML = "";

        data.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item[1] + " → " + item[2];
            list.appendChild(li);
        });

    } catch (error) {
        console.log("History load error");
    }
}


// 🔥 MAIN FUNCTION
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
        let response = await fetch("https://phishing-detector-isr5.onrender.com/predict", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url: url })
        });

        let data = await response.json();

        loader.classList.add("hidden");
        resultBox.classList.remove("hidden");

        // ✅ RESULT
        if (data.result === "Phishing") {
            resultText.innerHTML = "⚠️ Phishing Website";
            resultBox.style.borderLeft = "5px solid red";
        } else {
            resultText.innerHTML = "✅ Legitimate Website";
            resultBox.style.borderLeft = "5px solid green";
        }

        // ✅ CONFIDENCE
        confidenceText.innerHTML = "Confidence: " + (data.confidence || 90) + "%";

        // ✅ REASONS
        reasonsList.innerHTML = "";
        if (data.reasons) {
            data.reasons.forEach(reason => {
                let li = document.createElement("li");
                li.textContent = reason;
                reasonsList.appendChild(li);
            });
        }

        // 🔥 UPDATE HISTORY AFTER CHECK
        loadHistory();

    } catch (error) {
        loader.classList.add("hidden");
        alert("Error connecting backend");
    }
}


// 🔥 LOAD HISTORY ON PAGE LOAD
window.onload = loadHistory;
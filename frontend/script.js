// 🔥 LOAD HISTORY FUNCTION (OUTSIDE)
async function loadHistory() {
    const response = await fetch("https://phishing-detector-isr5.onrender.com/history");
    const data = await response.json();
    renderCharts(data); // ✅ ADD THIS LINE

    const list = document.getElementById("historyList");
    list.innerHTML = "";

    data.forEach(item => {
        const li = document.createElement("li");

        let badge = item[2] === "Phishing"
            ? `<span class="badge red">Phishing</span>`
            : `<span class="badge green">Legitimate</span>`;

        li.innerHTML = `
            <div class="history-card">
                <p>${item[1]}</p>
                ${badge}
            </div>
        `;

        list.appendChild(li);
    });
}


// 🔥 MAIN FUNCTION
async function checkURL() {
    let url = document.getElementById("urlInput").value;
    if (!url.startsWith("http")) {
    url = "https://" + url;
}
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
            resultText.style.color = "#ff4d4d";
            resultBox.style.background = "rgba(255,0,0,0.15)";
        } else {
            resultText.innerHTML = "✅ Legitimate Website";
            resultText.style.color = "#00ff99";
            resultBox.style.background = "rgba(0,255,0,0.15)";
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

function renderCharts(data) {
    let phishing = 0;
    let legit = 0;

    data.forEach(item => {
        if (item[2] === "Phishing") phishing++;
        else legit++;
    });

    // PIE CHART
    new Chart(document.getElementById("pieChart"), {
        type: 'pie',
        data: {
            labels: ['Phishing', 'Legitimate'],
            datasets: [{
                data: [phishing, legit],
                backgroundColor: ['#ff4d4d', '#00cc66']
            }]
        }
    });

    // BAR CHART
    new Chart(document.getElementById("barChart"), {
        type: 'bar',
        data: {
            labels: ['Phishing', 'Legitimate'],
            datasets: [{
                label: 'Count',
                data: [phishing, legit],
                backgroundColor: ['#ff4d4d', '#00cc66']
            }]
        }
    });
}

// 🔥 LOAD HISTORY ON PAGE LOAD
window.onload = loadHistory;
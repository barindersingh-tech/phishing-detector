// 🔥 LOAD HISTORY FUNCTION
async function loadHistory() {
    try {
        const response = await fetch("https://phishing-detector-isr5.onrender.com/history");
        const data = await response.json();

        const list = document.getElementById("historyList");
        list.innerHTML = "";

        data.reverse().forEach(item => {
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

    } catch (error) {
        console.log("History load failed");
    }
}


// 🔥 MAIN FUNCTION
async function checkURL() {
    let url = document.getElementById("urlInput").value;

    // ✅ AUTO FIX URL
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

        // ✅ SCAN REPORT (SAFE CHECKS)
        document.getElementById("riskScore").innerHTML =
            "Risk Score: " + (data.risk_score ?? "N/A") + "/100";

        document.getElementById("riskLevel").innerHTML =
            "Risk Level: " + (data.risk_level ?? "N/A");

        document.getElementById("explanation").innerHTML =
            data.explanation || "No explanation available";

        // ✅ REASONS
        reasonsList.innerHTML = "";
        if (data.reasons && data.reasons.length > 0) {
            data.reasons.forEach(reason => {
                let li = document.createElement("li");
                li.textContent = reason;
                reasonsList.appendChild(li);
            });
        }

        // 🔥 UPDATE HISTORY
        loadHistory();

    } catch (error) {
        loader.classList.add("hidden");
        alert("Error connecting backend");
    }
}


// 🔥 LOAD ON PAGE START
window.onload = loadHistory;


// 🌙 THEME TOGGLE (SAFE VERSION)
document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("themeToggle");

    if (!toggleBtn) return; // ✅ prevents error

    // Load saved theme
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light");
        toggleBtn.innerHTML = "☀️";
    }

    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light");

        if (document.body.classList.contains("light")) {
            localStorage.setItem("theme", "light");
            toggleBtn.innerHTML = "☀️";
        } else {
            localStorage.setItem("theme", "dark");
            toggleBtn.innerHTML = "🌙";
        }
    });
});
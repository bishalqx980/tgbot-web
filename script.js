document.addEventListener("DOMContentLoaded", function() {
    const date = new Date();
    const currentYear = date.getFullYear();

    const copyrightElement = document.getElementById("copyrightYear");
    if (copyrightElement) {
        copyrightElement.innerHTML = `2023 - ${currentYear}`;
    }

    // Load saved bot from localstorage
    loadSavedBots();

    // Save bot token
    document.getElementById("saveBot").addEventListener("click", async function() {
        const botToken = document.getElementById("botToken").value.trim();

        if (!botToken) {
            alert("Please enter a bot token!");
            return;
        }

        // Validate token format (simplified check)
        if (!botToken.includes(":")) {
            alert("Invalid bot token format. It should be in the format '123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11'");
            return;
        }
        
        await saveBotToken(botToken);
    });

    // Send Message
    document.getElementById("sendMessage").addEventListener("click", async function() {
        const chatID = document.getElementById("chatID").value.trim();
        const messageText = document.getElementById("messageText").value;
        const selectedBot = document.querySelector(".bot-card.selected");
        
        if (!selectedBot) {
            alert("Please select a bot first");
            return;
        }
        
        if (!chatID) {
            alert("Please enter a chat ID");
            return;
        }
        
        if (!messageText) {
            alert("Please enter a message");
            return;
        }

        const botToken = selectedBot.getAttribute("token");
        await sendMessage(botToken, chatID, messageText);
    });

    const botSelect = document.getElementById("botSelect");
    if (botSelect) {
        botSelect.addEventListener("click", function() {
            const interactionSection = document.getElementById("interactionSection");
            if (interactionSection) {
                interactionSection.classList.remove("hidden");
            }
        });
    }
});

async function loadSavedBots() {
    const botList = document.getElementById("botList");
    botList.innerHTML = "";
    
    const savedBots = JSON.parse(localStorage.getItem("savedBotTokens")) || [];
    if (savedBots.length === 0) {
        botList.innerHTML = "<p>No bots saved yet. Add a bot using the form above.</p>";
        return;
    }
    
    savedBots.forEach(async (botToken) => {
        await fetchBotInfo(botToken);
    });
}

async function saveBotToken(botToken) {
    let savedBots = JSON.parse(localStorage.getItem("savedBotTokens")) || [];

    // Check if bot already exists
    if (savedBots.some(bot => bot === botToken)) {
        alert("This bot is already saved");
        return;
    }

    // Add new bot
    savedBots.push(botToken);
    localStorage.setItem("savedBotTokens", JSON.stringify(savedBots));

    // Clear input
    document.getElementById("botToken").value = "";

    // Refresh bot list
    await fetchBotInfo(botToken);
}

async function fetchBotInfo(botToken) {
    const botList = document.getElementById("botList");

    // Loading Card
    const loadingCard = document.createElement("div");
    loadingCard.className = "bot-card";
    loadingCard.id = "botSelect";
    loadingCard.setAttribute("token", botToken);
    loadingCard.innerHTML = `
    <div class="bot-avatar">!</div>
    <div class="bot-info">
        <div class="bot-name">Loading...</div>
        <div class="bot-username">Loading...</div>
    </div>
    <div class="bot-remove">Remove</div>
    `;

    botList.append(loadingCard);

    // Getting Bot info
    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
        if (response.ok) {
            const data = await response.json();
            let botInfo = data.result;
            botInfo.error = false;
            updateBotCard(botToken, botInfo);
        } else {
            updateBotCard(botToken, {
                first_name: "Invalid Token",
                username: "Error",
                error: true
            });
        }
    } catch (error) {
        updateBotCard(botToken, {
            first_name: "Connection Error",
            username: "Error",
            error: true
        });
    }
}

function updateBotCard(botToken, botInfo) {
    const botCards = document.querySelectorAll('.bot-card[token="' + botToken + '"]');
    
    botCards.forEach(card => {
        if (botInfo.error) {
            card.innerHTML = `
                <div class="bot-avatar" style="background-color: #ffebee; color: #f44336;">!</div>
                <div class="bot-info">
                    <div class="bot-name">${botInfo.first_name}</div>
                    <div class="bot-username">Invalid token</div>
                </div>
                <div class="bot-remove">Remove</div>
            `;
            card.style.opacity = "0.7";
            card.style.cursor = "not-allowed";
        } else {
            // Create a unique color based on bot username for the avatar
            const usernameHash = Array.from(botInfo.username).reduce((acc, char) => acc + char.charCodeAt(0), 0);
            const hue = usernameHash % 360;
            const avatarColor = `hsl(${hue}, 70%, 65%)`;

            card.innerHTML = `
                <div class="bot-avatar" style="background-color: ${avatarColor}; color: white;">${botInfo.first_name.charAt(0)}</div>
                <div class="bot-info">
                    <div class="bot-name">${botInfo.first_name}</div>
                    <div class="bot-username">@${botInfo.username}</div>
                </div>
                <div class="bot-remove">Remove</div>
            `;
            
            // Add click event to select bot
            card.addEventListener("click", function() {
                // Deselect all bots
                document.querySelectorAll(".bot-card").forEach(c => c.classList.remove("selected"));
                
                // Select this bot
                this.classList.add("selected");
                
                // Show interaction section
                document.getElementById("interactionSection").classList.remove("hidden");
                
                // Update selected bot info
                document.getElementById("selectedBotInfo").innerHTML = `
                    <p>Selected bot: <strong>${botInfo.first_name}</strong> (@${botInfo.username})</p>
                `;
            });
        }
    });
}

async function sendMessage(botToken, chatID, text) {
    const responseArea = document.getElementById("responseArea");
    responseArea.textContent = "Sending message...";

    const payload = {
        chat_id: chatID,
        text: text
    };

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        responseArea.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        responseArea.textContent = "Error: " + error.message;
    }
}

const API = "https://api.telegram.org/bot";

let bots = JSON.parse(
    localStorage.getItem("telegram_bots") || "[]"
);

let activeBotId = localStorage.getItem("active_bot_id");

let activeBot = null;
let pollingTimer = null;
let updateOffset = 0;
let latestUser = null;

const $ = id => document.getElementById(id);

function saveBots() {
    localStorage.setItem(
        "telegram_bots",
        JSON.stringify(bots)
    );
}

function telegramUrl(method) {
    return `${API}${activeBot.token}/${method}`;
}

async function telegram(method, options = {}) {

    const response = await fetch(
        telegramUrl(method),
        options
    );

    const data = await response.json();

    if (!data.ok) {
        throw new Error(
            data.description || "Telegram API error"
        );
    }

    return data.result;
}

function showModal() {

    $("connectModal").classList.remove("hidden");

    $("botToken").value = "";

    $("connectError").classList.add("hidden");

    $("botToken").focus();
}

function hideModal() {
    $("connectModal").classList.add("hidden");
}

function renderBots() {

    const list = $("botList");

    list.innerHTML = "";

    if (!bots.length) {

        list.innerHTML = `
            <div class="muted">
                No bots connected
            </div>
        `;

        return;
    }

    bots.forEach(bot => {

        const item = document.createElement("div");

        item.className =
            `bot-item ${
                bot.id === activeBotId
                    ? "active"
                    : ""
            }`;

        item.innerHTML = `
            <div class="bot-name">

                <strong>
                    ${escapeHtml(bot.name)}
                </strong>

                <small>
                    @${escapeHtml(
                        bot.username || "unknown"
                    )}
                </small>

            </div>

            <button
                class="delete-bot"
                data-id="${bot.id}"
            >
                ×
            </button>
        `;

        item.addEventListener("click", event => {

            if (
                event.target.classList.contains(
                    "delete-bot"
                )
            ) {
                return;
            }

            selectBot(bot.id);
        });

        list.appendChild(item);
    });

    document
        .querySelectorAll(".delete-bot")
        .forEach(button => {

            button.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    deleteBot(
                        event.target.dataset.id
                    );
                }
            );

        });
}

function selectBot(id) {

    stopPolling();

    activeBotId = id;

    activeBot = bots.find(
        bot => bot.id === id
    );

    if (!activeBot) {

        showEmpty();

        return;
    }

    localStorage.setItem(
        "active_bot_id",
        id
    );

    updateOffset = 0;

    latestUser = null;

    renderBots();

    $("emptyState").classList.add("hidden");

    $("dashboard").classList.remove("hidden");

    $("disconnectBtn").classList.remove("hidden");

    $("botTitle").textContent =
        activeBot.name;

    $("botStatus").textContent =
        `@${activeBot.username}`;

    renderBotInfo();

    $("messages").innerHTML = "";

    $("userInfo").innerHTML = `
        <p class="muted">
            No user messages received yet.
        </p>
    `;

    startPolling();
}

function showEmpty() {

    activeBot = null;

    $("emptyState").classList.remove(
        "hidden"
    );

    $("dashboard").classList.add(
        "hidden"
    );

    $("disconnectBtn").classList.add(
        "hidden"
    );

    $("botTitle").textContent =
        "No Bot Selected";

    $("botStatus").textContent =
        "Connect a Telegram bot to begin";
}

async function connectBot() {

    const token =
        $("botToken").value.trim();

    if (!token) {

        showConnectError(
            "Enter a bot token."
        );

        return;
    }

    $("connectBtn").disabled = true;

    $("connectBtn").textContent =
        "Connecting...";

    try {

        const response = await fetch(
            `${API}${token}/getMe`
        );

        const data =
            await response.json();

        if (!data.ok) {

            throw new Error(
                data.description ||
                "Invalid bot token"
            );
        }

        const bot = data.result;

        const existing =
            bots.find(
                item =>
                    item.token === token
            );

        if (existing) {

            existing.name =
                bot.first_name ||
                bot.username;

            existing.username =
                bot.username;

            existing.id =
                String(bot.id);

        } else {

            bots.push({

                id: String(bot.id),

                name:
                    bot.first_name ||
                    bot.username,

                username:
                    bot.username,

                token

            });

        }

        saveBots();

        const savedBot =
            bots.find(
                item =>
                    item.token === token
            );

        hideModal();

        selectBot(
            savedBot.id
        );

    } catch (error) {

        showConnectError(
            error.message
        );

    } finally {

        $("connectBtn").disabled =
            false;

        $("connectBtn").textContent =
            "Connect";
    }
}

function showConnectError(message) {

    $("connectError").textContent =
        message;

    $("connectError").classList.remove(
        "hidden"
    );
}

function deleteBot(id) {

    const bot =
        bots.find(
            item => item.id === id
        );

    if (!bot) {
        return;
    }

    const confirmed =
        confirm(
            `Remove ${bot.name}?`
        );

    if (!confirmed) {
        return;
    }

    bots =
        bots.filter(
            item => item.id !== id
        );

    saveBots();

    if (activeBotId === id) {

        stopPolling();

        activeBotId = null;

        localStorage.removeItem(
            "active_bot_id"
        );

        showEmpty();
    }

    renderBots();
}

function renderBotInfo() {

    if (!activeBot) {
        return;
    }

    $("botInfo").innerHTML = `

        <div class="info-item">
            <span>Name</span>
            <strong>
                ${escapeHtml(
                    activeBot.name
                )}
            </strong>
        </div>

        <div class="info-item">
            <span>Username</span>
            <strong>
                @${escapeHtml(
                    activeBot.username
                )}
            </strong>
        </div>

        <div class="info-item">
            <span>Bot ID</span>
            <strong>
                ${escapeHtml(
                    activeBot.id
                )}
            </strong>
        </div>

        <div class="info-item">
            <span>Status</span>
            <strong>
                Connected
            </strong>
        </div>

    `;
}

async function sendMessage() {

    const chatId =
        $("chatId").value.trim();

    const text =
        $("messageText").value;

    const parseMode =
        $("parseMode").value;

    if (!chatId || !text) {

        showResult(
            "Chat ID and message are required.",
            true
        );

        return;
    }

    const params =
        new URLSearchParams();

    params.append(
        "chat_id",
        chatId
    );

    params.append(
        "text",
        text
    );

    if (parseMode) {

        params.append(
            "parse_mode",
            parseMode
        );
    }

    try {

        await telegram(
            "sendMessage",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded"
                },

                body: params
            }
        );

        showResult(
            "Message sent successfully."
        );

        $("messageText").value = "";

    } catch (error) {

        showResult(
            error.message,
            true
        );
    }
}

async function sendMedia(type) {

    const chatId =
        $("chatId").value.trim();

    if (!chatId) {

        showResult(
            "Enter a Chat ID / User ID first.",
            true
        );

        return;
    }

    let fileInput;
    let captionInput;
    let field;

    if (type === "photo") {

        fileInput =
            $("photoFile");

        captionInput =
            $("photoCaption");

        field =
            "photo";
    }

    if (type === "document") {

        fileInput =
            $("documentFile");

        captionInput =
            $("documentCaption");

        field =
            "document";
    }

    if (type === "video") {

        fileInput =
            $("videoFile");

        captionInput =
            $("videoCaption");

        field =
            "video";
    }

    const file =
        fileInput.files[0];

    if (!file) {

        showResult(
            `Select a ${type} first.`,
            true
        );

        return;
    }

    const form =
        new FormData();

    form.append(
        "chat_id",
        chatId
    );

    form.append(
        field,
        file
    );

    if (
        captionInput.value.trim()
    ) {

        form.append(
            "caption",
            captionInput.value.trim()
        );
    }

    try {

        await telegram(
            `send${capitalize(type)}`,
            {
                method: "POST",
                body: form
            }
        );

        showResult(
            `${capitalize(type)} sent successfully.`
        );

        fileInput.value = "";

        captionInput.value = "";

    } catch (error) {

        showResult(
            error.message,
            true
        );
    }
}

async function getChatInfo() {

    const chatId =
        $("infoChatId").value.trim();

    if (!chatId) {

        $("chatInfo").textContent =
            "Enter a chat ID.";

        return;
    }

    try {

        const chat =
            await telegram(
                "getChat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body:
                        new URLSearchParams({
                            chat_id:
                                chatId
                        })
                }
            );

        $("chatInfo").textContent =
            JSON.stringify(
                chat,
                null,
                2
            );

    } catch (error) {

        $("chatInfo").textContent =
            error.message;
    }
}

function startPolling() {

    if (!activeBot) {
        return;
    }

    $("pollStatus").textContent =
        "Polling every 3 seconds";

    pollUpdates();

    pollingTimer =
        setInterval(
            pollUpdates,
            3000
        );
}

function stopPolling() {

    if (pollingTimer) {

        clearInterval(
            pollingTimer
        );

        pollingTimer = null;
    }

    if (
        $("pollStatus")
    ) {

        $("pollStatus").textContent =
            "Polling stopped";
    }
}

async function pollUpdates() {

    if (!activeBot) {
        return;
    }

    try {

        const params =
            new URLSearchParams();

        params.append(
            "timeout",
            "0"
        );

        if (updateOffset) {

            params.append(
                "offset",
                String(updateOffset)
            );
        }

        const updates =
            await telegram(
                "getUpdates",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded"
                    },

                    body: params
                }
            );

        updates.forEach(
            update => {

                updateOffset =
                    update.update_id + 1;

                processUpdate(
                    update
                );
            }
        );

    } catch (error) {

        $("pollStatus").textContent =
            `Polling error: ${error.message}`;
    }
}

function processUpdate(update) {

    const message =
        update.message ||
        update.edited_message;

    if (!message) {
        return;
    }

    const from =
        message.from;

    const chat =
        message.chat;

    latestUser =
        from;

    renderUserInfo(
        from
    );

    addMessage(
        message,
        chat,
        from
    );
}

function addMessage(
    message,
    chat,
    from
) {

    const container =
        $("messages");

    let text = "";

    if (message.text) {

        text =
            message.text;

    } else if (message.caption) {

        text =
            message.caption;

    } else if (message.photo) {

        text =
            "[Photo]";

    } else if (message.video) {

        text =
            "[Video]";

    } else if (message.document) {

        text =
            `[Document: ${
                message.document.file_name ||
                "file"
            }]`;

    } else {

        text =
            "[Unsupported message type]";
    }

    const time =
        new Date(
            (
                message.date ||
                Math.floor(
                    Date.now() / 1000
                )
            ) * 1000
        );

    const item =
        document.createElement(
            "div"
        );

    item.className =
        "message";

    item.innerHTML = `

        <div class="message-header">

            <strong>
                ${escapeHtml(
                    from.first_name ||
                    from.username ||
                    "Unknown User"
                )}
            </strong>

            <small>
                ${escapeHtml(
                    chat.title ||
                    chat.username ||
                    String(chat.id)
                )}

                ·

                ${time.toLocaleTimeString()}
            </small>

        </div>

        <div class="message-text">
            ${escapeHtml(text)}
        </div>

    `;

    container.prepend(
        item
    );
}

function renderUserInfo(user) {

    if (!user) {
        return;
    }

    $("userInfo").innerHTML = `

        <div class="info-grid">

            <div class="info-item">
                <span>User ID</span>
                <strong>
                    ${escapeHtml(
                        String(user.id)
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>First Name</span>
                <strong>
                    ${escapeHtml(
                        user.first_name ||
                        ""
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Last Name</span>
                <strong>
                    ${escapeHtml(
                        user.last_name ||
                        "N/A"
                    )}
                </strong>
            </div>

            <div class="info-item">
                <span>Username</span>
                <strong>
                    ${
                        user.username
                            ? "@" +
                              escapeHtml(
                                  user.username
                              )
                            : "N/A"
                    }
                </strong>
            </div>

        </div>
    `;
}

function showResult(
    message,
    error = false
) {

    const box =
        $("resultBox");

    box.textContent =
        message;

    box.classList.remove(
        "hidden"
    );

    if (error) {

        box.style.background =
            "#32191c";

        box.style.border =
            "1px solid #703137";

        box.style.color =
            "#ff8e96";

    } else {

        box.style.background =
            "#10291d";

        box.style.border =
            "1px solid #245f3b";

        box.style.color =
            "#8ee0ac";
    }

    setTimeout(
        () => {
            box.classList.add(
                "hidden"
            );
        },
        4000
    );
}

function capitalize(value) {

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );
}

function escapeHtml(value) {

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}

function switchTab(tab) {

    document
        .querySelectorAll(".tab")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.tab === tab
            );

        });

    document
        .querySelectorAll(".tab-content")
        .forEach(content => {

            content.classList.add(
                "hidden"
            );

        });

    $(`${tab}Tab`)
        .classList.remove(
            "hidden"
        );
}

$("addBotBtn")
    .addEventListener(
        "click",
        showModal
    );

$("emptyConnectBtn")
    .addEventListener(
        "click",
        showModal
    );

$("closeModal")
    .addEventListener(
        "click",
        hideModal
    );

$("connectBtn")
    .addEventListener(
        "click",
        connectBot
    );

$("botToken")
    .addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                connectBot();
            }

        }
    );

$("sendMessageBtn")
    .addEventListener(
        "click",
        sendMessage
    );

$("sendPhotoBtn")
    .addEventListener(
        "click",
        () => sendMedia("photo")
    );

$("sendDocumentBtn")
    .addEventListener(
        "click",
        () => sendMedia("document")
    );

$("sendVideoBtn")
    .addEventListener(
        "click",
        () => sendMedia("video")
    );

$("getChatBtn")
    .addEventListener(
        "click",
        getChatInfo
    );

$("clearMessagesBtn")
    .addEventListener(
        "click",
        () => {
            $("messages").innerHTML = "";
        }
    );

$("useLastUserBtn")
    .addEventListener(
        "click",
        () => {

            if (!latestUser) {

                showResult(
                    "No user has sent a message yet.",
                    true
                );

                return;
            }

            $("chatId").value =
                latestUser.id;

            showResult(
                `User ID ${latestUser.id} selected.`
            );
        }
    );

$("disconnectBtn")
    .addEventListener(
        "click",
        () => {

            stopPolling();

            activeBot = null;

            activeBotId = null;

            localStorage.removeItem(
                "active_bot_id"
            );

            showEmpty();

            renderBots();
        }
    );

document
    .querySelectorAll(".tab")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {
                switchTab(
                    button.dataset.tab
                );
            }
        );

    });

window.addEventListener(
    "beforeunload",
    stopPolling
);

renderBots();

if (
    activeBotId &&
    bots.some(
        bot =>
            bot.id === activeBotId
    )
) {

    selectBot(
        activeBotId
    );

} else {

    showEmpty();
}
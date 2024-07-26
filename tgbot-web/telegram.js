async function send_req(method, chat_id=null, message=null) {
    const bot_token = document.getElementById("bot_token").value;
    if (!bot_token) {
        loadMsg("bot token not provided!", true);
        return
    }

    if (chat_id) {
        var api_url = `https://api.telegram.org/bot${bot_token}/${method}?chat_id=${chat_id}&text=${message}&parse_mode=HTML`;
    } else {
        var api_url = `https://api.telegram.org/bot${bot_token}/${method}`;
    }
    
    statusMsg("please wait, sending request...");
    loadMsg("please wait, sending request...");
    
    try {
        var res = await fetch(api_url);
        if (!res.ok) {
            var status = res.status;
            var error_codes = {
                "303": "303 SEE_OTHER",
                "400": "400 BAD_REQUEST",
                "401": "401 UNAUTHORIZED",
                "403": "403 FORBIDDEN",
                "404": "404 NOT_FOUND",
                "406": "406 NOT_ACCEPTABLE",
                "420": "420 FLOOD",
                "500": "500 INTERNAL"
            }

            if (status in error_codes) {
                msg = error_codes[status];
            } else {
                msg = "An error occured!";
            }

            statusMsg(msg);
            loadMsg(msg, true);
            return
        }

        statusMsg("Check log...");
        var data = await res.json();
        return data; // returns object
    } catch (error) {
        console.error(error);
        statusMsg(error);
        loadMsg(error);
    }
}

function getBot() {
    send_req("getMe")
    .then(
        res => {
            if (!res) {
                return
            }

            var res = res.result;
            var msg = "----- > bot.info() < -----\n" +
            `• name: ${res.first_name}\n` +
            `• id: ${res.id}\n` +
            `• username: ${res.username}\n` +
            `• can join groups: ${res.can_join_groups}\n` +
            `• can read group messages: ${res.can_read_all_group_messages}\n` +
            `• supports inline queries: ${res.supports_inline_queries}\n` +
            `• can connect to business: ${res.can_connect_to_business}\n` +
            "----- END -----";
            loadMsg(msg);
        }
    )
}

function getUpdate() {
    send_req("getUpdates")
    .then(
        res => {
            if (!res) {
                return
            }

            var res = res.result;
            var msg = res;
            console.log(res)
            loadMsg(msg);

        }
    )
}

function sendmsg() {
    const chat_id = document.getElementById("chat_id").value;
    const message = document.getElementById("message").value;

    if (!chat_id) {
        statusMsg("chat id not provided!");
        loadMsg("chat id not provided!", true);
        return
    }else if (!message) {
        statusMsg("message not provided!");
        loadMsg("message not provided!", true);
        return
    }

    send_req("sendMessage", chat_id, message)
    .then(
        res => {
            if (!res) {
                return
            }

            var res = res.result;
            console.log(res)
            msg = `${res}`

            loadMsg(`>> Message sent!`, true);
            loadMsg();
        }
    )
}
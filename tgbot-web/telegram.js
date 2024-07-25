async function send_req(method, chat_id=null, message=null) {
    const bot_token = document.getElementById("bot_token").value;
    if (!bot_token) {
        loadmsg("bot token not provided!", true);
        return
    }

    if (chat_id) {
        var api_url = `https://api.telegram.org/bot${bot_token}/${method}?chat_id=${chat_id}&text=${message}&parse_mode=HTML`;
    } else {
        var api_url = `https://api.telegram.org/bot${bot_token}/${method}`;
    }

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

            loadmsg(msg, true);
            return
        }

        var data = await res.json();
        return data; // returns object
    } catch (error) {
        console.error(error);
        loadmsg(error);
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
            loadmsg(msg);
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
            loadmsg(msg);

        }
    )
}

function sendmsg() {
    const chat_id = document.getElementById("chat_id").value;
    const message = document.getElementById("message").value;

    if (!chat_id) {
        loadmsg("chat id not provided!", true);
        return
    }else if (!message) {
        loadmsg("message not provided!", true);
        return
    }

    send_req("sendMessage", chat_id, message)
    .then(
        res => {
            if (!res) {
                return
            }

            loadmsg(`message_id: ${res.result.message_id} >> Message sent!`, true);
        }
    )
}
function preload() {
    setInterval(() => {
        var date_now = new Date();
        var hour = date_now.getHours();
        var day_night = "am";
        if (hour > 12) {
            var hour = hour - 12;
            var day_night = "pm";
        }
        var min = date_now.getMinutes();
        var sec = date_now.getSeconds();

        document.getElementById("clock").innerHTML = hour + ":" + min + ":" + sec + " " + day_night;
    }, 1000);

    document.getElementById("year").innerHTML = new Date().getFullYear();

    document.getElementById("bot_token").value = localStorage.getItem("bot_token");
    document.getElementById("chat_id").value = localStorage.getItem("chat_id");

    var welcome_msg = "tgbot-web v4.0 alpha developed by @bishalqx980 || https://bishalqx980.github.io/bishalqx980/";
    console.log(welcome_msg);
    loadmsg(welcome_msg);
    getBot();
}

function loadmsg(msg, notify=false, timeout=5000) {
    document.getElementById("log").innerHTML += `\n>> ${msg}\n`; // log area
    if (notify) {
        document.getElementById("log_msg").innerHTML = ">> " + msg;
        document.getElementById("floating-div").style.display = "";
        document.getElementById("floating-div").className = "floating-div";

        setTimeout(() => {
            document.getElementById("floating-div").className = "floating-div collapse-floating-div";
            setTimeout(() => {
                document.getElementById("floating-div").style.display = "none";
            }, 1000);
        }, timeout);
    }
}

function storeValue() {
    const bot_token = document.getElementById("bot_token").value;
    const chat_id = document.getElementById("chat_id").value;

    localStorage.setItem("bot_token", bot_token);
    localStorage.setItem("chat_id", chat_id);

    loadmsg("bot token & chat id stored!", true);
}

function clearlog() {
    document.getElementById("log").innerHTML = "// ----- LOG CLEARED ----- //";
}
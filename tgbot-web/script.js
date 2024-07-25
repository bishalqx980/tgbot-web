function preload() {
    setInterval(() => {
        date_now = new Date()
        hour = date_now.getHours()
        day_night = "am"
        if (hour > 12) {
            hour = hour - 12
            day_night = "pm"
        }
        min = date_now.getMinutes()
        sec = date_now.getSeconds()

        document.getElementById("clock").innerHTML = hour + ":" + min + ":" + sec + " " + day_night 
    }, 1000);

    document.getElementById("year").innerHTML = new Date().getFullYear()

    document.getElementById("bot_token").value = localStorage.getItem("bot_token")
    document.getElementById("chat_id").value = localStorage.getItem("chat_id")

    console.log("tgbot-web v4.0 alpha developed by @bishalqx980 || https://bishalqx980.github.io/bishalqx980/");




    send_req()
}

function loadmsg(msg, timeout=5000) {
    document.getElementById("log_msg").innerHTML = msg
    document.getElementById("log").innerHTML += msg + "\n" // log area
    document.getElementById("floating-div").style.display = ""
    document.getElementById("floating-div").className = "floating-div"

    setTimeout(() => {
        document.getElementById("floating-div").className = "floating-div collapse-floating-div"
        setTimeout(() => {
            document.getElementById("floating-div").style.display = "none"
        }, 1000);
    }, timeout);
}

function storeValue() {
    bot_token = document.getElementById("bot_token").value
    chat_id = document.getElementById("chat_id").value

    localStorage.setItem("bot_token", bot_token)
    localStorage.setItem("chat_id", chat_id)

    loadmsg("bot token & chat id stored!")
}

function send_req(method) {
    bot_token = document.getElementById("bot_token").value;
    url = `https://api.telegram.org/bot${bot_token}/${method}`;

    x = fetch(url).then()

    console.log(x)
}
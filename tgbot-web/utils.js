// send api req
async function send_req(url) {
    try {
        let api = await fetch(url);
        let api_status = api.status
        let api_res = await api.text()

        sessionStorage.setItem("api_status", api_status)
        sessionStorage.setItem("api_res", api_res)

        return {api_status, api_res};
    }catch (error) {
        console.error(">> Error during API request:", error)
    }
}

// log msg
function log(text, level = "info") {
    // Parameters: info, success, error
    let log = document.getElementById("log");

    if (level == "info") {
        log.innerHTML = text
    }else if (level == "success") {
        log.innerHTML = "<span style='color: rgb(0, 255, 0);'>" + text + "</span>"
    }else if (level == "error") {
        log.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + text + "</span>"
    }
}

function bot_log(text, level = "info") {
    // Parameters: info, success, error
    let bot_log = document.getElementById("bot_log");

    if (level == "info") {
        bot_log.innerHTML = text
    }else if (level == "success") {
        bot_log.innerHTML = "<span style='color: rgb(0, 255, 0);'>" + text + "</span>"
    }else if (level == "error") {
        bot_log.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + text + "</span>"
    }
}

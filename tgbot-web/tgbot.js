// Onload
function load() {
    let bot_token = localStorage.getItem("bot_token");
    let chat_id = localStorage.getItem("chat_id");
    let msg = localStorage.getItem("msg");
    document.getElementById("bot_token").value = bot_token;
    document.getElementById("chat_id").value = chat_id;
    document.getElementById("msg").value = msg;
    console.log("Developed by @bishalqx980 || https://bishalqx980.github.io/bishalqx980/");
}

function clock() {
    let new_date = new Date();

    var hour = new_date.getHours();
    var am_pm = "am"
    if (hour > 12) {
        var hour = hour - 12
        var am_pm = "pm"
    }
    var min = new_date.getMinutes();
    if (min < 10) {
        var min = `0${min}`
    }
    var sec = new_date.getSeconds();
    if (sec < 10) {
        var sec = `0${sec}`
    }

    document.getElementById("clock").innerHTML = `${hour}:${min}:${sec} ${am_pm}`;
}
setInterval(clock, 1)

// msg_check
function msg_check() {
    let msg = document.getElementById("msg");
    localStorage.setItem("msg", msg.value)
    if (msg.value.length > 1800) {
        log("Error // inputed text is: " + msg.value.length + " | Max_length: 1800", "error")
    }else {
        log("inputed text is: " + msg.value.length)
    }
}

// attach the bot
async function attach() {
    event.preventDefault();
    let bot_token = document.getElementById("bot_token").value;
    
    if (bot_token != "") {
        let url = `https://api.telegram.org/bot${bot_token}/getMe`;

        let res = await send_req(url);

        if (res.api_status == 200) {
            log("Bot attached successfully", "success");
        }else {
            log(res.api_res, "error");
        }
        bot_log(res.api_res);
    }else {
        log("`<u>bot token</u>` can't leave empty!", "error");
    }
}

// get chat info
async function get_chat_info() {
    event.preventDefault();
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;

    if (bot_token != "") {
        if (chat_id != "") {
            let url = `https://api.telegram.org/bot${bot_token}/getChat?chat_id=${chat_id}`;

            let res = await send_req(url);
            if (res.api_status == 200) {
                let json_res = JSON.parse(res.api_res);

                var first_name = json_res.result.first_name;
                var last_name = json_res.result.last_name;
                if (last_name == undefined) {
                    var last_name = ""
                }
                var id = json_res.result.id;
                var bio = json_res.result.bio;
                var username = json_res.result.username;
                var photo_id = json_res.result.photo.big_file_id;
                var chat_type = json_res.result.type;

                var text = (`
                    Name: ${first_name} ${last_name}\n
                    ID: ${id}\n
                    Bio: ${bio}\n
                    Username: ${username}\n
                    Photo ID: ${photo_id}\n
                    Chat Type: ${chat_type}\n`
                );
                log("info generated...!", "success")
                bot_log(text);
            }else {
                log(res.api_res)
                bot_log(res.api_res);
            }
        }else {
            log("`<u>chat id</u>` can't leave empty!", "error");
        }
    }else {
        log("`<u>bot token</u>` can't leave empty!", "error");
    }
}
// localStorage
function save_value() {
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;

    if (bot_token != "" & chat_id != "") {
        localStorage.setItem("bot_token", bot_token);
        localStorage.setItem("chat_id", chat_id);
        log("value's saved successfully!", "success");
    }else {
        log("Empty value can't be saved!", "success");
    }
}

// sendmsg
function sendmsg() {
    event.preventDefault();
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;
    let msg = document.getElementById("msg").value;
    let url = `https://api.telegram.org/bot${bot_token}/sendMessage?chat_id=${chat_id}&parse_mode=HTML&text=${msg}`;

}








// Special Method's
function get_chatinfo() {
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;
    let url = `https://api.telegram.org/bot${bot_token}/getChat?chat_id=${chat_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("log");
        let server_update_response = document.getElementById("server_update_response");
        if (api_res == 200) {
            let json = api.response;
            let data = JSON.parse(json);
            let output_data = {};
            for (let key in data) {
                output_data[key] = data[key];
            }
            let output_json = JSON.stringify(output_data, null, 2);
            server_update_response.innerHTML = syntaxHighlight(output_json);
            server_update_response.scrollTop = server_update_response.scrollHeight;
            res.innerHTML = "ℹ info generated!"
        }else {
            res.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>"
        }
    }
}
function get_admin() {
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;
    let url = `https://api.telegram.org/bot${bot_token}/getChatAdministrators?chat_id=${chat_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("log");
        let server_update_response = document.getElementById("server_update_response");
        if (api_res == 200) {
            let json = api.response;
            let data = JSON.parse(json);
            let output_data = {};
            for (let key in data) {
                output_data[key] = data[key];
            }
            let output_json = JSON.stringify(output_data, null, 2);
            server_update_response.innerHTML = syntaxHighlight(output_json);
            server_update_response.scrollTop = server_update_response.scrollHeight;
            res.innerHTML = "group/channel admin's list generated!"
        }else {
            res.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>"
        }
    }
}
function get_member() {
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;
    let url = `https://api.telegram.org/bot${bot_token}/getChatMemberCount?chat_id=${chat_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("log");
        let server_update_response = document.getElementById("server_update_response");
        if (api_res == 200) {
            let json = api.response;
            let data = JSON.parse(json);
            let output_data = {};
            for (let key in data) {
                output_data[key] = data[key];
            }
            let output_json = JSON.stringify(output_data, null, 2);
            server_update_response.innerHTML = syntaxHighlight(output_json);
            server_update_response.scrollTop = server_update_response.scrollHeight;
            res.innerHTML = "<b>Group/Channel Members [number] Generated!</b>"
        }else {
            res.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>"
        }
    }
}
function get_memberinfo() {
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;
    let user_id = document.getElementById("user_id").value;
    let url = `https://api.telegram.org/bot${bot_token}/getChatMember?chat_id=${chat_id}&user_id=${user_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("log");
        let server_update_response = document.getElementById("server_update_response");
        if (api_res == 200) {
            let json = api.response;
            let data = JSON.parse(json);
            let output_data = {};
            for (let key in data) {
                output_data[key] = data[key];
            }
            let output_json = JSON.stringify(output_data, null, 2);
            server_update_response.innerHTML = syntaxHighlight(output_json);
            server_update_response.scrollTop = server_update_response.scrollHeight;
            res.innerHTML = "<b>Group/Channel Specific Member Info Generated!</b>"
        }else {
            res.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>"
        }
    }
}
function leave_chat() {
    let check = prompt("⚠ Type 'LEAVE' then click 'OK' if you really want to leave the Group/Channel!\n\nElse Cancel this!")
    if (check == "LEAVE") {
        leave_chat_confirm()
        alert("Group/Channel Left Succesfully!")
    }else {
        alert("You typed Wrong Word or you canceled this!")
    }
}
function leave_chat_confirm() {
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;
    let url = `https://api.telegram.org/bot${bot_token}/leaveChat?chat_id=${chat_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("log");
        let server_update_response = document.getElementById("server_update_response");
        if (api_res == 200) {
            let json = api.response;
            let data = JSON.parse(json);
            let output_data = {};
            for (let key in data) {
                output_data[key] = data[key];
            }
            let output_json = JSON.stringify(output_data, null, 2);
            server_update_response.innerHTML = syntaxHighlight(output_json);
            server_update_response.scrollTop = server_update_response.scrollHeight;
            res.innerHTML = "<b>Group/Channel Left Succesfully!</b>"
        }else {
            res.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>"
        }
    }
}


// sendPhoto
function sendphoto() {
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;
    let msg = document.getElementById("msg").value;
    let url = `https://api.telegram.org/bot${bot_token}/sendPhoto?chat_id=${chat_id}&parse_mode=HTML&photo=${msg}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("log");
        if (api_res == 200) {
            res.innerHTML = "photo sent!"
        }else {
            res.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>"
        }
    }
}
// Send local Photo
function send_local_photo() {
    let bot_token = document.getElementById("bot_token").value;
    let chat_id = document.getElementById("chat_id").value;
    let res = document.getElementById("log");

    res.innerHTML = "<span style='color: rgb(255, 0, 0);'>Uploading!</span>"

    let fileInput = document.getElementById("local_photo");
    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("photo", file, file.name);
    axios.post(`https://api.telegram.org/bot${bot_token}/sendPhoto?chat_id=${chat_id}`, formData, {
        headers: {
        'Content-Type': 'multipart/form-data'
        }
    })
    .then((response) => {
        res.innerHTML = "photo sent!";
    })
    .catch((error) => {
        res.innerHTML = "<span style='color: rgb(255, 0, 0);'>photo not sent!</span>";
    });
}
// get_bot_info
function get_bot_info() {
    let bot_token = document.getElementById("bot_token").value;
    let url = `https://api.telegram.org/bot${bot_token}/getMe`;
    
    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let server_update_response = document.getElementById("server_update_response");
        if (api_res == 200) {
            let json = api.response;
            let data = JSON.parse(json);
            let output_data = {};
            for (let key in data) {
                output_data[key] = data[key];
            }
            let output_json = JSON.stringify(output_data, null, 2);
            server_update_response.innerHTML = syntaxHighlight(output_json);
            server_update_response.scrollTop = server_update_response.scrollHeight;
        }else {
            server_update_response.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>"
        }
    }
} 
// getUpdates
function get_update() {
    let bot_token = document.getElementById("bot_token").value;
    let url = `https://api.telegram.org/bot${bot_token}/getUpdates`;
  
    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
      let api_res = api.status;
      let server_update_response = document.getElementById("server_update_response");
      if (api_res == 200) {
        let json = api.response;
        let data = JSON.parse(json);
        let output_data = {};
        for (let key in data) {
          output_data[key] = data[key];
        }
        let output_json = JSON.stringify(output_data, null, 2);
        server_update_response.innerHTML = syntaxHighlight(output_json);
        server_update_response.scrollTop = server_update_response.scrollHeight;
      } else {
        server_update_response.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>";
      }
    }
  }
  
  // Helper function to add syntax highlighting to the JSON string
function syntaxHighlight(json) {
    json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      function(match) {
        var cls = "";
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = "";
          } else {
            cls = "";
          }
        } else if (/true|false/.test(match)) {
          cls = "";
        } else if (/null/.test(match)) {
          cls = "";
        }
        return cls + match;
      }
    );
}
  
// font button
function bold_font() {
    document.getElementById("msg").value += "<b></b>"
}
function italic_font() {
    document.getElementById("msg").value += "<i></i>"
}
function underline_font() {
    document.getElementById("msg").value += "<u></u>"
}
function strikethrough_font() {
    document.getElementById("msg").value += "<s></s>"
}
function monospace_font() {
    document.getElementById("msg").value += "<pre></pre>"
}
function spoiler_font() {
    document.getElementById("msg").value += "<tg-spoiler></tg-spoiler>"
}
function createlink_font() {
    document.getElementById("msg").value += "<a href='http://www.example.com/'></a>"
}

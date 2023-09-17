// Onload
function load() {
    alert("Under Development. Use with Caution ⚠...!")
    let year = new Date().getFullYear();
    document.getElementById("year").innerHTML = year;
    let bot_api = localStorage.getItem("bot_api")
    let chat_id = localStorage.getItem("chat_id")
    document.getElementById("bot_api").value = bot_api;
    document.getElementById("chat_id").value = chat_id;
    console.log("telegram-bot-playground v3 by @bishalqx980 || https://bishalqx980.github.io/bishalqx980/");
}
// attach the bot
function attach() {
    let bot_api = document.getElementById("bot_api").value;
    let url = `https://api.telegram.org/bot${bot_api}/getMe`;
    
    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("res");
        if (api_res == 200) {
            res.innerHTML = "bot attached successfully!";
        }else {
            res.innerHTML = "<span style='color: rgb(255, 0, 0);'>bot api changed or bot deleted!</span>";
        }
    }
}
// setting
function setting() {
    let check = prompt("Developer Zone !! Give Security CODE to access!!")
    if (check == "9800") {
        document.getElementById("bot_api").style.display = "none";
        document.getElementById("chat_id").style.display = "none";
        document.getElementById("devzonebtn1").style.display = "none";
        document.getElementById("devzonebtn2").style.display = "none";
        document.getElementById("devzonebtn3").style.display = "none";
        document.getElementById("bot_api").value = "6674105637:AAFUfdsdEWt1LOBy3f1LuMO8oqp5sZ28jAg";
        document.getElementById("chat_id").value = "2134776547";
        attach();
    }else {
        alert("Developer Access Only !!");
    }
}
// localStorage
function save_value() {
    let bot_api = document.getElementById("bot_api").value;
    let chat_id = document.getElementById("chat_id").value;        
    localStorage.setItem("bot_api", bot_api)
    localStorage.setItem("chat_id", chat_id)
    document.getElementById("res").innerHTML = "value's saved successfully!"
}
function show_advance_option() {
    let get_div = document.getElementById("group_btn")
    let get_btn = document.getElementById("advance_option_btn")
    if (get_div.style.display == "none") {
        get_div.style.display = ""
        get_btn.innerHTML = "⇑ Advance Option's ⇑"
    }else {
        get_div.style.display = "none"
        get_btn.innerHTML = "⇓ Advance Option's ⇓"
    }
}
// Special Method's
function get_chatinfo() {
    let bot_api = document.getElementById("bot_api").value;
    let chat_id = document.getElementById("chat_id").value;
    let url = `https://api.telegram.org/bot${bot_api}/getChat?chat_id=${chat_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("res");
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
    let bot_api = document.getElementById("bot_api").value;
    let chat_id = document.getElementById("chat_id").value;
    let url = `https://api.telegram.org/bot${bot_api}/getChatAdministrators?chat_id=${chat_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("res");
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
    let bot_api = document.getElementById("bot_api").value;
    let chat_id = document.getElementById("chat_id").value;
    let url = `https://api.telegram.org/bot${bot_api}/getChatMemberCount?chat_id=${chat_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("res");
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
    let bot_api = document.getElementById("bot_api").value;
    let chat_id = document.getElementById("chat_id").value;
    let user_id = document.getElementById("user_id").value;
    let url = `https://api.telegram.org/bot${bot_api}/getChatMember?chat_id=${chat_id}&user_id=${user_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("res");
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
    let bot_api = document.getElementById("bot_api").value;
    let chat_id = document.getElementById("chat_id").value;
    let url = `https://api.telegram.org/bot${bot_api}/leaveChat?chat_id=${chat_id}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("res");
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
// sendMessage
function sendmsg() {
    let bot_api = document.getElementById("bot_api").value;
    let chat_id = document.getElementById("chat_id").value;
    let message = document.getElementById("message").value;
    let url = `https://api.telegram.org/bot${bot_api}/sendMessage?chat_id=${chat_id}&parse_mode=HTML&text=${message}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("res");
        if (api_res == 200) {
            res.innerHTML = "message sent!"
        }else {
            res.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>"
        }
    }
}
// Check_message_length
function check_length() {
    let textarea = document.getElementById("message");
    let res = document.getElementById("res")
    if (textarea.value.length > 1800) {
        res.innerHTML = "<span style='color: rgb(255, 0, 0);'>Error »</span> Inputed text is: " + textarea.value.length + " | Max_length: 1800"
    }else {
        res.innerHTML = "Inputed text is: " + textarea.value.length
    }
}
// sendPhoto
function sendphoto() {
    let bot_api = document.getElementById("bot_api").value;
    let chat_id = document.getElementById("chat_id").value;
    let message = document.getElementById("message").value;
    let url = `https://api.telegram.org/bot${bot_api}/sendPhoto?chat_id=${chat_id}&parse_mode=HTML&photo=${message}`;

    let api = new XMLHttpRequest();
    api.open("GET", url, true);
    api.send();
    api.onload = function() {
        let api_res = api.status;
        let res = document.getElementById("res");
        if (api_res == 200) {
            res.innerHTML = "photo sent!"
        }else {
            res.innerHTML = "<span style='color: rgb(255, 0, 0);'>" + api_res + api.response + "</span>"
        }
    }
}
// Send local Photo
function send_local_photo() {
    let bot_api = document.getElementById("bot_api").value;
    let chat_id = document.getElementById("chat_id").value;
    let res = document.getElementById("res");

    res.innerHTML = "<span style='color: rgb(255, 0, 0);'>Uploading!</span>"

    let fileInput = document.getElementById("local_photo");
    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("photo", file, file.name);
    axios.post(`https://api.telegram.org/bot${bot_api}/sendPhoto?chat_id=${chat_id}`, formData, {
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
    let bot_api = document.getElementById("bot_api").value;
    let url = `https://api.telegram.org/bot${bot_api}/getMe`;
    
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
    let bot_api = document.getElementById("bot_api").value;
    let url = `https://api.telegram.org/bot${bot_api}/getUpdates`;
  
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
    document.getElementById("message").value += "<b></b>"
}
function italic_font() {
    document.getElementById("message").value += "<i></i>"
}
function underline_font() {
    document.getElementById("message").value += "<u></u>"
}
function strikethrough_font() {
    document.getElementById("message").value += "<s></s>"
}
function monospace_font() {
    document.getElementById("message").value += "<pre></pre>"
}
function spoiler_font() {
    document.getElementById("message").value += "<tg-spoiler></tg-spoiler>"
}
function createlink_font() {
    document.getElementById("message").value += "<a href='http://www.example.com/'></a>"
}

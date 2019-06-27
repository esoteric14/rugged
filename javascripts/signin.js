 window.onload = function(e) {
    if (globalUserId) {
       redirect();
    }
    basePath = $("#ruggedmonitoring_logo").attr("src").substr(0, $("#ruggedmonitoring_logo").attr("src").indexOf("/images"));
    $("form").submit(function(event) {
     
      event.preventDefault();
        switch (this.id) {
            case "user_login_form":
                var $lg_username = $("#login_username").val();
                var $lg_password = $("#login_password").val();
                Login($lg_username, $lg_password, function(response) {
                    if (response === null) {
                        alert("User name or Password is incorrect.")
                    } else {
                        globalUserId = response._kid;
                        sessionStorage.setItem("userid", response._kid);
                        sessionStorage.setItem("displayname", response.display_name);
                        sessionStorage.setItem("username", response.user_name);
                        
                        if(document.getElementById("stay_signed_in").checked == true){
                          localStorage.setItem("userid", response._kid);
                          localStorage.setItem("displayname", response.display_name);
                          localStorage.setItem("username", response.user_name);
                        }
                        
                        $("#user_login").attr("style", "display:none;");
                        $("#logout_button").attr("style", "");
                        document.getElementById("user_login_form").reset();
                        redirect();
                        
                    }
                });
                return false;
            default:
                return false
        }
        return false
    });
    
    var drawingIds;
    var userManualIds;
    var applicationNoteIds;
    var rConnectIds;
    if (globalUserId) {
        LoadUserData(globalUserId)
    } else {}
};
function redirect(){
  if(getQueryStringValue("redirect")){
      window.location = decodeURIComponent(getQueryStringValue("redirect"));
    }else{
      window.location = "/downloads";
    }
}
function getQueryStringValue (key) {  
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}  

function Login(username, password, callback) {
    var body = {
        WebsiteId: "5bed49a7299c810001e423bd",
        PropertySegments: [{
            PropertyName: "ruggedmonitoring",
            PropertyDataType: "ruggedmonitoring",
            Type: 5,
            Index: null,
            Sort: null,
            Filter: null
        }, {
            PropertyName: "users",
            PropertyDataType: "user",
            Type: 1,
            Index: 0,
            Limit: 10,
            Filter: {
                user_name: {'$regex': '^' + username + '$' ,'$options':'i'},
                password: password.trim(),
                isactive: true
            },
            ObjectKeys : {_kid : true, display_name : true, user_name : true},
        }]
    };
    var settings = {
        async: true,
        crossDomain: true,
        url: "https://api2.kitsune.tools/language/v1/5b17f3f68c794c0517139145/get-data-by-property",
        method: "POST",
        headers: {
            Authorization: "5bbdc89b52f52c0001001592",
            "Content-Type": "application/json",
            "Postman-Token": "2723adcb-fc97-4e7f-8fa6-98a15078676b"
        },
        data: JSON.stringify(body)
    };
    $.ajax(settings).done(function(response) {
        if (response && response.Data && response.Data.length > 0) {
            callback(response.Data[0])
        } else {
            callback(null)
        }
    })
}



window.onload = function(e) {
    if (!sessionStorage.getItem("userid")) {
        $("#user_login").attr("style", "");
        hideLoader()
    }
    basePath = $("#ruggedmonitoring_logo").attr("src").substr(0, $("#ruggedmonitoring_logo").attr("src").indexOf("/images"));
    $("#user_welcome").html('<ul class="header-login-links inline-block list-style-none f-right"><li><a href="[[View(‘/sign-in.html’).geturl()]]">Customer Login </a></li><li class="separator">|</li><li><a href="[[View(‘/sign-up.html’).geturl()]]">Signup </a></li></ul>');
    $("form").submit(function() {
        switch (this.id) {
            case "user_login_form":
                var $lg_username = $("#login_username").val();
                var $lg_password = $("#login_password").val();
                Login($lg_username, $lg_password, function(response) {
                    if (response === null) {
                        alert("User name/Password incorrect.")
                    } else {
                        sessionStorage.setItem("userid", response._kid);
                        sessionStorage.setItem("displayname", response.display_name);
                        sessionStorage.setItem("username", response.user_name);
                        $("#user_login").attr("style", "display:none;");
                        $("#logout_button").attr("style", "");
                        document.getElementById("user_login_form").reset();
                        LoadUserData(response._kid)
                    }
                });
                return false;
            default:
                return false
        }
        return false
    });
    var userid = sessionStorage.getItem("userid");
    var drawingIds;
    var userManualIds;
    var applicationNoteIds;
    var rConnectIds;
    if (userid) {
        LoadUserData(userid)
    } else {}
};

function LoadUserData(userid) {
    diplayLoader();
    getUserDetails(userid, function(data) {
        if (data) {
            $("#user_welcome").html("<div class='user_welcome_inner'><span>Welcome " + data.display_name + ", </span><a href='#' onclick='Logout()' style='color:red;'>Logout</a></div>");
            drawingIds = data.drawing_ids ? data.drawing_ids.split(",").map(function(item) {
                return item.trim()
            }) : null;
            userManualIds = data.user_manual_ids ? data.user_manual_ids.split(",").map(function(item) {
                return item.trim()
            }) : null;
            applicationNoteIds = data.application_note_ids ? data.application_note_ids.split(",").map(function(item) {
                return item.trim()
            }) : null;
            rConnectIds = data.rconnect_ids ? data.rconnect_ids.split(",").map(function(item) {
                return item.trim()
            }) : null;
            var commonListHtml = "<div class='list_link' style='margin-bottom:0px;'><p><a title='{1}' href='" + basePath + "{0}' target='_blank'>{1}</a></p></div>";
            var appNotesHTML = "<li><div class='content-box-full'><h4 class='item-heading'>{0} | {1}</h4><a href='/app-notes-details'><img src='https://via.placeholder.com/30' alt=''><span class='link-text'>{2}</a><p class='text'>{3}</p></div></li>";
            if (drawingIds && drawingIds.length > 0) {
                getDrawings(drawingIds, function(data) {
                    var innerHtml = "";
                    data.forEach(function(drawing) {
                        innerHtml += commonListHtml.replace("{0}", drawing.download_link.url).replace("{1}", drawing.download_link.description);
                    });
                    $("#drawings_list_section").attr("style", "");
                    $("#drawings_list").html(innerHtml)
                })
            }
            if (applicationNoteIds && applicationNoteIds.length > 0) {
                getApplicationNotes(applicationNoteIds, function(data) {
                  console.log(JSON.stringify(data));
                    var innerHtml = "";
                    data.forEach(function(note) {
                        innerHtml += appNotesHTML.replace("{0}", note.title).replace("{1}", note.createdon).replace("{2}", note.download_link.description).replace("{3}", note.brief_description);
                    });
                    $("#application_notes_section").attr("style", "");
                    $("#application_notes_list").html(innerHtml)
                })
            }
            if (userManualIds && userManualIds.length > 0) {
                getUserManuals(userManualIds, function(data) {
                    var innerHtml = "";
                    data.forEach(function(manual) {
                        innerHtml += commonListHtml.replace("{0}", manual.download_link.url).replace("{1}", manual.download_link.description).replace("{1}", manual.download_link.description)
                    });
                    $("#user_manuals_section").attr("style", "");
                    $("#user_manuals_list").html(innerHtml)
                })
            }
            if (rConnectIds && rConnectIds.length > 0) {
                getrConnect(rConnectIds, function(data) {
                    var innerHtml = "";
                    data.forEach(function(rcon) {
                        innerHtml += commonListHtml.replace("{0}", rcon.download_link.url).replace("{1}", rcon.download_link.description).replace("{1}", rcon.download_link.description)
                    });
                    $("#rconnect_list_section").attr("style", "");
                    $("#rconnect_list").html(innerHtml)
                })
            }
        }
        hideLoader()
    })
}

function diplayLoader() {
    $("#downloads_loader").attr("style", "")
}

function hideLoader() {
    $("#downloads_loader").attr("style", "display:none;")
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
                user_name: username,
                password: password
            }
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

function Logout() {
    $("#user_login").attr("style", "");
    
    var loginHTML = '<ul class="header-login-links inline-block list-style-none f-right"><li><a href="[[View(‘/sign-in.html’).geturl()]]">Customer Login </a></li><li class="separator">|</li><li><a href="[[View(‘/sign-up.html’).geturl()]]">Signup </a></li></ul>';
    $("#user_welcome").html(loginHTML);
    sessionStorage.removeItem("userid");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("displayname");
    $("#rconnect_list_section").attr("style", "display:none;");
    $("#user_manuals_section").attr("style", "display:none;");
    $("#application_notes_section").attr("style", "display:none;");
    $("#drawings_list_section").attr("style", "display:none;")
}

function RequestAccess() {
    window.location.href = "/contact-us?request_access=true"
}

function RequestPasswordReset() {
    window.location.href = "/contact-us?request_reset=true"
}

function getUserDetails(userid, callback) {
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
                _kid: userid
            }
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

function getDrawings(drawingIds, callback) {
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
            PropertyName: "drawings",
            PropertyDataType: "drawing",
            Type: 1,
            Index: 0,
            Limit: 10,
            ObjectKeys: {
                download_link: true
            },
            Filter: {
                drawing_id: {
                    $in: drawingIds
                }
            }
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
            callback(response.Data)
        } else {
            callback(null)
        }
    })
}

function getApplicationNotes(noteIds, callback) {
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
            PropertyName: "application_notes",
            PropertyDataType: "application_note",
            Type: 1,
            Index: 0,
            Limit: 10,
            ObjectKeys: {
                download_link: true,
                title: true,
                brief_description: true
            },
            Filter: {
                note_id: {
                    $in: noteIds
                }
            }
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
            callback(response.Data)
        } else {
            callback(null)
        }
    })
}

function getrConnect(rconnectIds, callback) {
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
            PropertyName: "rconnect_list",
            PropertyDataType: "rconnect",
            Type: 1,
            Index: 0,
            Limit: 10,
            ObjectKeys: {
                download_link: true
            },
            Filter: {
                rconnect_id: {
                    $in: rconnectIds
                }
            }
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
            callback(response.Data)
        } else {
            callback(null)
        }
    })
}

function getUserManuals(userManualIds, callback) {
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
            PropertyName: "user_manuals",
            PropertyDataType: "user_manual",
            Type: 1,
            Index: 0,
            Limit: 10,
            ObjectKeys: {
                download_link: true
            },
            Filter: {
                manual_id: {
                    $in: userManualIds
                }
            }
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
            callback(response.Data)
        } else {
            callback(null)
        }
    })
}
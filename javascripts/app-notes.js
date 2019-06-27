window.onload = function(e){ 
  
 if(globalUserId){
     LoadUserData(globalUserId);
   }
  basePath = $("#ruggedmonitoring_logo").attr("src").substr(0, $("#ruggedmonitoring_logo").attr("src").indexOf("/images"));
}
  function LoadUserData(userid){
      getUserDetails(userid, function(data){
              if(data){
                var applicationNoteIds = data.application_note_ids ? data.application_note_ids.split(",").map(function(item) { return item.trim(); }) : null;
                
                if(applicationNoteIds && applicationNoteIds.length > 0){
                  getUserAppNoteList(applicationNoteIds, function(applicationNoteListResult){
                    
                    //console.log(JSON.stringify(data));
                    //assigning the result to global var to access on filter
                    //userDownloadList = downlaodListResult;
                    updateUserApplicationNotes(applicationNoteListResult);
                  });
                  
                }
                 
              }
            });
  }
  function getUserAppNoteList(appNotesId, callback){
      var body = {
                      "WebsiteId": "5bed49a7299c810001e423bd",
                      "PropertySegments": [{
                          "PropertyName": "ruggedmonitoring",
                          "PropertyDataType": "ruggedmonitoring",
                          "Type": 5,
                          "Index": null,
                          "Sort": null,
                          "Filter": null
                      }, 
                      {
                          "PropertyName": "application_notes",
                          "PropertyDataType": "application_note",
                          "Type": 1,
                          "Index" : 0,
                          "Limit" : 100,
                          "Filter" : { "note_id" : {"$in" : appNotesId} },
                          //"ObjectKeys" : {"download_link" :  1}
                      }]
                    };
  	    var settings = {
                        "async": true,
                        "crossDomain": true,
                        "url": "https://api2.kitsune.tools/language/v1/5b17f3f68c794c0517139145/get-data-by-property",
                        "method": "POST",
                        "headers": {
                          "Authorization": "5bbdc89b52f52c0001001592",
                          "Content-Type": "application/json",
                          "Postman-Token": "2723adcb-fc97-4e7f-8fa6-98a15078676b"
                        },
                        "data": JSON.stringify(body)
                      }

          $.ajax(settings).done(function (response) {
            
            if(response && response.Data && response.Data.length > 0){
              callback(response.Data);
            }else{
              callback(null);
            }
            
          });
        
      }
      
  function updateUserApplicationNotes(applicationNoteListResult){
    if(applicationNoteListResult && applicationNoteListResult.length > 0){
      applicationNoteListResult.forEach(function(note){
        if(document.getElementById(note.note_id)){
          var element = document.getElementById(note.note_id);
          element.setAttribute("href", basePath + note.download_link.url);
          element.setAttribute("target", "_blank");
          element.setAttribute("title", note.download_link.description);
          element.setAttribute("download","");
          element.children[0].setAttribute("class", "list_link_unlock");
        }
      })
    }
  }
  
  
  
// App notes filter function 
function filterAppNotesByVertical(htmlelement){
    verticalFilter =  htmlelement.getAttribute("name")|| "all";
    filterAppNotes();
    document.getElementById("selected_vertical_text").innerText = htmlelement.innerText;
}
function filterAppNotesByProductCategory(htmlelement){
    categoryFilter =  htmlelement.getAttribute("name")|| "all";
    filterAppNotes();
    document.getElementById("selected_category_text").innerText = htmlelement.innerText;

}
function filterAppNotesBySearchKeyword(htmlelement){
  searchKeyword = htmlelement.value;
  filterAppNotes();
}

function filterAppNotes(){
  
    //console.log(appNotesList);

    if(appNotesList){
        var filteredResult = appNotesList;
         //vertical and category filter
        if(verticalFilter !== "all" || categoryFilter !== "all"){
          
           filteredResult = appNotesList.filter(function(appNoteItem){
              if(verticalFilter == "all"){
                  return appNoteItem.related_product_category_ids && appNoteItem.related_product_category_ids.indexOf(categoryFilter) >= 0;
              }
              else if(categoryFilter == "all"){
                  return appNoteItem.related_vertical_ids && appNoteItem.related_vertical_ids.indexOf(verticalFilter) >= 0;
              }
              else {
                  return (appNoteItem.related_vertical_ids && appNoteItem.related_vertical_ids.indexOf(verticalFilter) >= 0) && (appNoteItem.related_product_category_ids && appNoteItem.related_product_category_ids.indexOf(categoryFilter) >= 0);
              }
          });
        }

        //keyword filter
        if(searchKeyword && searchKeyword.trim()){
          var patt = new RegExp(searchKeyword.trim(), "i");
          filteredResult = filteredResult.filter(function (item){
            return patt.test(item.title) || patt.test(item.brief_description);
          })
        }
        renderAppNotes(filteredResult);
    }
}

//AppNotes render function
function renderAppNotes(appNotesItems){

    var appNotesHTML = "<li><div class='content-box-appnote'><h4 class='item-heading'>{0} | <span> {1}</span><br><a target='_blank' href='{2}'>{5}{6}<span class='link-text'>{3}</span></a></h4><div>{4}</div></div></li>";
    
    var innerHtml= "";
    var thumbImg = "";
    var isPrivate = false;
    
    
    
    appNotesItems.forEach(function(appNote){
      
      var noteURL = "/downloads/application-notes/" + appNote.title + "/" + appNote._kid;
      
      if(typeof appNote.thumbnail_image !== "undefined"){
        thumbImg = "<img src="+ appNote.thumbnail_image.url +">";
      }
      
       if( appNote.is_private == true){
        isPrivate = "<span class='list_link_lock'></span><span class='icon-file'></span>";
        noteURL = "/downloads";
      } else{
        isPrivate = " ";
      }
      console.log(appNote.is_private);

     
        innerHtml += appNotesHTML.replace("{0}", 'APN#' + appNote.note_id)
                                  .replace("{1}", moment(appNote.createdon).format('Do MMM YYYY'))
                                  .replace("{2}", noteURL)
                                  .replace("{3}", appNote.title)
                                  .replace("{4}", appNote.brief_description)
                                  .replace("{5}", thumbImg)
                                  .replace("{6}", isPrivate);
    })
    
    $("#download-items-list").html(innerHtml);
                
}
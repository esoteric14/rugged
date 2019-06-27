    
  window.onload = function(e){ 
    
         //check if user is already logged in
        if(!globalUserId){
          
            hideLoader();
           
        }

        userDownloadList = [];
        verticalFilter = "all";
        categoryFilter = "all";
        searchKeyword = "";
        
        basePath = $("#ruggedmonitoring_logo").attr("src").substr(0, $("#ruggedmonitoring_logo").attr("src").indexOf("/images"));
        
       
    
        
         var drawingIds;
         var userManualIds;
         var applicationNoteIds;
         var rConnectIds;
         
         if(globalUserId){
           //Get UserDetails
            //$("#user_details").attr("style", "");
            
           LoadUserData(globalUserId, categoryid);
          
         }
         else{
           
         }
  }
  
  function LoadUserData(userid, category){
    diplayLoader();
     getUserDetails(userid, function(data){
              if(data){
                
                
                
                var downloadIds = data.download_ids ? data.download_ids.split(",").map(function(item) { return item.trim(); }) : null;
                
                if(downloadIds && downloadIds.length > 0){
                  getDownloadList(downloadIds, category, function(downlaodListResult){
                    
                    //console.log(JSON.stringify(data));
                    //assigning the result to global var to access on filter
                    userDownloadList = downlaodListResult;
                    commonFilter(userDownloadList);
                  });
                  
                }
                 
              }
              hideLoader()
            });
  }

  function diplayLoader(){
     $("#downloads_loader").attr("style", "");
  }
  function hideLoader(){
      $("#downloads_loader").attr("style", "display:none;");
  }
 
 
  
  function RequestAccess(){
    window.location.href = "/contact-us?request_access=true"
  }
  function RequestPasswordReset(){
    window.location.href = "/contact-us?request_reset=true"
  }
  

      
      
  function getDownloadList(downloadIds, category, callback){
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
                          "PropertyName": "download_list",
                          "PropertyDataType": "download_item",
                          "Type": 1,
                          "Index" : 0,
                          "Limit" : 100,
                          "Filter" : { "download_category_id" : category,  "uid" : {"$in" : downloadIds} }
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
      
function filterByVertical(htmlelement){
    verticalFilter =  htmlelement.getAttribute("name")|| "all";
    commonFilter();
    document.getElementById("selected_vertical_text").innerText = htmlelement.innerText;
}
function filterByProductCategory(htmlelement){
    categoryFilter =  htmlelement.getAttribute("name")|| "all";
    commonFilter();
    document.getElementById("selected_category_text").innerText = htmlelement.innerText;

}
function filterBySearchKeyword(htmlelement){
  searchKeyword = htmlelement.value;
  commonFilter();
}
 
function commonFilter(){
  
    console.log(userDownloadList);

    if(userDownloadList){
        var filteredResult = userDownloadList;
         //vertical and category filter
        if(verticalFilter !== "all" || categoryFilter !== "all"){
          
           filteredResult = userDownloadList.filter(function(downloadItem){
              if(verticalFilter == "all"){
                  return downloadItem.related_product_category_ids && downloadItem.related_product_category_ids.indexOf(categoryFilter) >= 0;
              }
              else if(categoryFilter == "all"){
                  return downloadItem.related_vertical_ids && downloadItem.related_vertical_ids.indexOf(verticalFilter) >= 0;
              }
              else {
                  return (downloadItem.related_vertical_ids && downloadItem.related_vertical_ids.indexOf(verticalFilter) >= 0) && (downloadItem.related_product_category_ids && downloadItem.related_product_category_ids.indexOf(categoryFilter) >= 0);
              }
          });
        }

        //keyword filter
        if(searchKeyword && searchKeyword.trim()){
          var patt = new RegExp(searchKeyword.trim(), "i");
          filteredResult = filteredResult.filter(function (item){
            return patt.test(item.download_link.description) || patt.test(item.download_link.url);
          })
        }
        renderDownloadHtml(filteredResult);
    }
}

//common render funciton that render download items
function renderDownloadHtml(downloadItems){
    //var commonListHtml = "<li><a href='{0}' download target='_blank'>{1} <i class='icon-download-alt'></i></a></li>";
    //var commonListHtml = "<div class='list_link' style='margin-bottom:0px;'><p><a title='{1}' href='"+basePath+"{0}' target='_blank'>{1}</a></p></div>";
    
    
    var downloadDetialsHtml = "<li><div class='content-box'><h4 class='item-heading'>{0} | <span> {4}</span> <a download target='_blank' href='{1}'><img src='/images/icons/download_file_icon.png'><span class='link-text'>{2}</span> </a></h4></div><div class='button-box'><a download target='_blank' href='{3}' class='btn btn-primary footer-btn'>Download</a></div></li>";
 
    var innerHtml= "";
    var fileName = "";
    downloadItems.forEach(function(download){
      fileName = download.download_link && download.download_link.url ? download.download_link.url.substr(download.download_link.url.lastIndexOf('/')+1) : "No File";
     
        innerHtml += downloadDetialsHtml.replace("{0}", download.download_link.description)
                                        .replace("{1}", basePath + download.download_link.url)
                                        .replace("{2}", fileName)
                                        .replace("{3}", basePath + download.download_link.url)
                                        .replace("{4}", moment(download.createdon).format('Do MMM YYYY'));
    })
    
    //$("#drawings_list_section").attr("style", "");
    $("#download-items-list").html(innerHtml);
                
}


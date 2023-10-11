chrome.action.onClicked.addListener(function(activeTab) {
    var newURL = "chrome://newtab";
    chrome.tabs.create({ url: newURL });

});


chrome.runtime.onInstalled.addListener(function (object) {
 
    chrome.storage.local.get(['enable_note','shortcut_sts', 'favs', 'shortcuts','timeformat'], function(dragonballzresult) {
    	if(!dragonballzresult.enable_note){
            chrome.storage.local.set({enable_note: 'yes'});
        }
				
        if(!dragonballzresult.timeformat){
    		chrome.storage.local.set({timeformat: '24h'});
    	}
        if(!dragonballzresult.shortcut_sts){
    		chrome.storage.local.set({shortcut_sts: 'Show'});
    	}
        if(!dragonballzresult.favs){
            chrome.storage.local.set({favs: '[]'});
        }
    	if(!dragonballzresult.shortcuts){
    		chrome.storage.local.set({shortcuts: '[]'});
    	}
	});
	
	
	
	
});

chrome.runtime.onMessage.addListener(function(t, a, o) {
  if (t.topSites) {
      chrome.topSites.get(function(e) {
          o(e);
      });
      return true;
  }
});





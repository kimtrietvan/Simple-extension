function dragonballz671dragElement(e,t,n){var o=0,i=0,s=0,r=0;function l(e){e=e||window.event,s=e.clientX,r=e.clientY,document.onmouseup=a,document.onmousemove=d}function d(t){t=t||window.event,o=s-t.clientX,i=r-t.clientY,s=t.clientX,r=t.clientY,e.style.top=helpers.pxTOvh(e.offsetTop-i)+"vh",e.style.left=helpers.pxTOvw(e.offsetLeft-o)+"vw"}function a(){e.offsetTop<80&&(e.style.top=helpers.pxTOvh(80)+"vh"),window.innerHeight-e.offsetTop<30&&(e.style.top=helpers.pxTOvh(window.innerHeight-80)+"vh"),e.offsetLeft+e.offsetWidth<30&&(e.style.left=helpers.pxTOvw(-100)+"vw"),window.innerWidth-e.offsetLeft<30&&(e.style.left=helpers.pxTOvw(window.innerWidth-100)+"vw"),n&&n(e),document.onmouseup=null,document.onmousemove=null}t?t.onmousedown=l:e.onmousedown=l}function dragonballz671resizeElem(e,t,n){t.addEventListener("mousedown",(function(e){window.addEventListener("mousemove",i,!1),window.addEventListener("mouseup",s,!1);var t=e.target.className;t.indexOf("m-b")>-1&&(o="v"),t.indexOf("m-r")>-1&&(o="h"),t.indexOf("m-b-r")>-1&&(o="")}),!1);var o=null;function i(t){"h"===o?e.style.width=t.clientX-e.offsetLeft+"px":("v"===o||(e.style.width=t.clientX-e.offsetLeft+"px"),e.style.height=t.clientY-e.offsetTop+"px")}function s(t){n&&n(e),window.removeEventListener("mousemove",i,!1),window.removeEventListener("mouseup",s,!1)}}var helpers={uuid_v4:function(){var e=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)};return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()},vwTOpx:function(e){var t=window,n=document,o=n.documentElement,i=n.getElementsByTagName("body")[0],s=t.innerWidth||o.clientWidth||i.clientWidth;return t.innerHeight||o.clientHeight||i.clientHeight,s*e/100},vhTOpx:function(e){var t=window,n=document,o=n.documentElement,i=n.getElementsByTagName("body")[0];return t.innerWidth||o.clientWidth||i.clientWidth,(t.innerHeight||o.clientHeight||i.clientHeight)*e/100},pxTOvw:function(e){var t=window,n=document,o=n.documentElement,i=n.getElementsByTagName("body")[0],s=t.innerWidth||o.clientWidth||i.clientWidth;return t.innerHeight||o.clientHeight||i.clientHeight,100*e/s},pxTOvh:function(e){var t=window,n=document,o=n.documentElement,i=n.getElementsByTagName("body")[0];return t.innerWidth||o.clientWidth||i.clientWidth,100*e/(t.innerHeight||o.clientHeight||i.clientHeight)}};window.lastNote=null,window.storedNotes=[],window.noteColors={blue:{title:"#c9ecf8",body:"#c0e1f5"},green:{title:"#c8f8c3",body:"#A3ED9B"},pink:{title:"#f1c3f1",body:"#ecb2ec"},purple:{title:"#d6cffe",body:"#cbc0fe"},yellow:{title:"#fdfcbf",body:"#fcfaae"},white:{title:"#f5f5f5",body:"#ececec"}};var noteContainer=null,stnButtonWrapper=null,stnButton=null,footer=null,StickyNote=function(e,t){var n=["blue","green","pink","purple","yellow","white"];this.id=helpers.uuid_v4(),this.text=null,this.top=helpers.pxTOvh(100),this.left=helpers.pxTOvw(50),this.width=180,this.height=150,this.color=n[Math.floor(Math.random()*n.length)],this.fontSize=16,e&&"object"==typeof e&&(e.id&&(this.id=e.id),e.text&&(this.text=e.text),e.color&&(this.color=e.color),e.top&&(this.top=e.top),e.left&&(this.left=e.left),e.width&&(this.width=e.width),e.height&&(this.height=e.height),e.fontSize&&(this.fontSize=e.fontSize));var o=this,i=document.createElement("div");i.className="title-bar",i.style.height="28px",i.style.backgroundColor=window.noteColors[this.color].title,i.addEventListener("click",(function(e){e.stopPropagation()}));var s=document.createElement("button");s.className="stn-btn",s.innerHTML="&#10010;",s.style.display=e&&e.upset?"":"none",s.setAttribute("title","Create a new note"),s.addEventListener("click",(function(e){if(e.preventDefault(),e.stopPropagation(),window.storedNotes.length>=30)return alert("Too many notes have been created.\nPlease delete some notes to resume.");var t=0,n=0;window.lastNote&&(t=helpers.pxTOvh(window.lastNote.offsetTop+30),n=helpers.pxTOvw(window.lastNote.offsetLeft+30)),t<helpers.pxTOvh(80)&&(t=helpers.pxTOvh(80)),helpers.pxTOvh(window.innerHeight)-t<helpers.pxTOvh(160)&&(t=helpers.pxTOvh(80)),n+helpers.pxTOvw(a.offsetWidth)<helpers.pxTOvw(30)&&(n=helpers.pxTOvw(-100)),n+helpers.pxTOvw(a.offsetWidth)>helpers.pxTOvw(window.innerWidth)&&(n=helpers.pxTOvw(window.lastNote.offsetLeft+window.lastNote.offsetWidth+30-window.innerWidth));var i=new StickyNote({top:t,left:n},!0);o.onAddButtonClick&&o.onAddButtonClick(i)})),s.addEventListener("mousedown",(function(e){e.stopPropagation(),e.preventDefault()}));var r=document.createElement("button");function l(){s.style.display="initial",r.style.display="initial"}function d(){s.style.display="none",r.style.display="none"}r.className="stn-btn",r.innerHTML="&#10005;",r.style.display=e&&e.upset?"":"none",r.style.float="right",r.setAttribute("data-id",o.id),r.setAttribute("title","Close"),r.addEventListener("click",(function(e){e.preventDefault(),e.stopPropagation();var t=window.storedNotes.findIndex((function(t){return t.id===e.target.dataset.id}));if(t>-1){var n=window.storedNotes[t];window.storedNotes.splice(t,1),window.lastNote=null,0===window.storedNotes.length&&stnButton&&(stnButton.innerHTML="+ New Note"),o.remove(),o.onRemoved&&o.onRemoved(n)}})),r.addEventListener("mousedown",(function(e){e.preventDefault(),e.stopPropagation()})),i.appendChild(s),i.appendChild(r),this.titlebar=i;var a=document.createElement("div");a.className="sticky-note",a.setAttribute("data-id",this.id),a.setAttribute("tabindex",0),a.style.top=this.top+"vh",a.style.left=this.left+"vw",a.style.width=this.width+"px",a.style.height=this.height+"px",a.style.backgroundColor=window.noteColors[this.color].body;var c=document.createElement("textarea"),u=null,h=null;function f(e){h&&clearTimeout(h),h=setTimeout((function(){var t=window.storedNotes.findIndex((function(e){return e.id===o.id}));if(t>-1){var n=window.storedNotes[t];n.fontSize=e,o.onFontSizeChange(n)}}))}c.className="stn-content",c.value=this.text,c.style.fontSize=o.fontSize+"px",c.style.resize="none",c.addEventListener("input",(function(e){u&&clearTimeout(u),u=setTimeout((function(){var t=window.storedNotes.findIndex((function(e){return e.id===o.id}));if(t>-1){var n=window.storedNotes[t];n.text=e.target.value,o.onTextChange&&o.onTextChange(e,n)}}),500),o.text=e.target.value})),c.addEventListener("focus",(function(e){a.style.zIndex=100,this.style.resize="both",l()})),c.addEventListener("blur",(function(){this.style.resize="none",mouseleave=!1,a.style.zIndex=20,document.activeElement!==a&&d(),o.contextMenus&&o.contextMenus.parentNode.removeChild(o.contextMenus),o.contextMenus=null})),c.addEventListener("contextmenu",(function(e){function t(e,t){var n=document.createElement("div");n.className="context-menu-item",n.setAttribute("data-color",e),n.textContent=e,n.addEventListener("mousedown",(function(e){e.preventDefault(),e.stopPropagation()})),n.addEventListener("click",(function(e){e.preventDefault(),e.stopPropagation();var t=window.noteColors[this.dataset.color];o.note.style.backgroundColor=t.body,o.titlebar.style.backgroundColor=t.title,o.contextMenus&&o.contextMenus.parentNode.removeChild(o.contextMenus),o.contextMenus=null,o.color=this.dataset.color;var n=window.storedNotes.findIndex((function(e){return e.id===o.id}));if(n>-1){var i=window.storedNotes[n];i.color=this.dataset.color,o.onColorChange(i)}})),t.appendChild(n)}e.preventDefault(),o.contextMenus&&o.contextMenus.parentNode.removeChild(o.contextMenus),o.contextMenus=null;var n=document.createElement("div");for(var i in n.className="stn-context-menu",window.noteColors)t(i,n);document.body.appendChild(n);var s=e.clientY,r=e.clientX;e.clientY+n.offsetHeight>window.innerHeight&&(s=e.clientY-n.offsetHeight),e.clientX+n.offsetWidth>window.innerWidth&&(r=e.clientX-n.offsetWidth),n.style.top=s+"px",n.style.left=r+"px",o.contextMenus=n,window.addEventListener("click",(function(e){o.contextMenus&&o.contextMenus.parentNode.removeChild(o.contextMenus),o.contextMenus=null}),!1),window.addEventListener("keydown",(function(e){27===(event.which||event.keyCode)&&(e.preventDefault(),o.contextMenus&&o.contextMenus.parentNode.removeChild(o.contextMenus),o.contextMenus=null)}),!1),this.contextmenu=n})),c.addEventListener("mousewheel",(function(e){if(!0===e.ctrlKey){e.preventDefault();var t=window.getComputedStyle(e.target),n=parseFloat(t["font-size"].replace(/[a-z]+/g,""));e.deltaY<0?n<120&&n++:n>8&&n--,e.target.style.fontSize=n+"px",f(n)}})),c.addEventListener("keydown",(function(e){if(9===e.which){e.preventDefault();var t=this.selectionStart;this.value=this.value.substring(0,this.selectionStart)+"\t"+this.value.substring(this.selectionEnd),this.selectionEnd=t+1}if(!0===e.ctrlKey&&(107===e.which||109===e.which)){var n=window.getComputedStyle(e.target),o=parseFloat(n["font-size"].replace(/[a-z]+/g,""));109===e.which?(e.preventDefault(),o>8&&o--):107===e.which&&(e.preventDefault(),o<120&&o++),e.target.style.fontSize=o+"px",f(o)}})),a.addEventListener("focus",(function(){this.style.zIndex=100,c.focus()})),a.addEventListener("blur",(function(){d(),a.style.zIndex=20,o.contextMenus&&o.contextMenus.parentNode.removeChild(o.contextMenus),o.contextMenus=null})),a.addEventListener("mouseover",(function(){l(),this.classList.add("active")})),a.addEventListener("mouseleave",(function(){c!==document.activeElement&&d()}));var p=document.createElement("div");p.className="inner",p.appendChild(this.titlebar),p.appendChild(c),a.appendChild(p);var w=document.createElement("div");w.className="m-p-r m-b";var v=document.createElement("div");v.className="m-p-r m-r";var m=document.createElement("div");m.className="m-p-r m-b-r",a.appendChild(w),a.appendChild(v),a.appendChild(m),noteContainer.appendChild(a),dragonballz671dragElement(a,this.titlebar,g),dragonballz671resizeElem(a,w,g),dragonballz671resizeElem(a,v,g),dragonballz671resizeElem(a,m,g),this.noteContent=c,this.note=a,window.lastNote=a;var y={id:this.id,top:helpers.pxTOvh(this.note.offsetTop),left:helpers.pxTOvw(this.note.offsetLeft),width:this.note.clientWidth,height:this.note.clientHeight,text:this.noteContent.value,color:this.color,fontSize:this.fontSize};function g(e){var t=window.storedNotes.find((function(t){return t.id===e.dataset.id}));t&&(t.top=helpers.pxTOvh(e.offsetTop),t.left=helpers.pxTOvw(e.offsetLeft),t.width=e.offsetWidth,t.height=e.offsetHeight,syncNote(0,t))}this.noteToSave=y,t&&(c.focus(),window.storedNotes.push(y),chrome.storage.local.set({notes:JSON.stringify(window.storedNotes)})),this.onAddButtonClick=function(e){syncNote(1,e.noteToSave)},this.onTextChange=function(e,t){syncNote(0,t)},this.onFontSizeChange=function(e){syncNote(0,e)},this.onColorChange=function(e){syncNote(0,e)},this.onRemoved=function(e){syncNote(-1,e)}};function syncNote(e,t,n){chrome.runtime.sendMessage({noteChange:{type:e,data:t,options:n}},(function(e){})),chrome.storage.local.set({notes:JSON.stringify(window.storedNotes)})}function removeAllNotes(){chrome.storage.local.set({notes:"[]"}),stnButton.innerHTML="+ New note",noteContainer.innerHTML="",window.storedNotes=[],window.lastNote=null}function addNoteSync(e){e&&"object"==typeof e&&(new StickyNote(e),stnButton.innerHTML="&#128465; Clear Notes")}function removeNoteSync(e){if(e&&"object"==typeof e){var t=window.storedNotes.findIndex((function(t){return t.id===e.id}));t>-1&&(window.storedNotes.splice(t,1),window.lastNote=null,0===window.storedNotes.length&&stnButton&&(stnButton.innerHTML="+ New Note"));var n=document.querySelector('.sticky-note[data-id="'+e.id+'"]');n&&n.parentNode.removeChild(n)}}function updateNoteSync(e){if(e&&"object"==typeof e){var t=document.querySelector('.sticky-note[data-id="'+e.id+'"]'),n=window.noteColors[e.color];t.style.top=e.top+"vh",t.style.left=e.left+"vw",t.style.width=e.width+"px",t.style.height=e.height+"px",t.style.backgroundColor=n.body;var o=t.querySelector(".title-bar");o&&(o.style.backgroundColor=n.title);var i=t.querySelector(".stn-content");i&&(i.value=e.text,i.style.fontSize=e.fontSize+"px")}}function enableStickyNote(e,t){e?loadNotes():(noteContainer&&noteContainer.parentNode.removeChild(noteContainer),stnButtonWrapper&&footer.removeChild(stnButtonWrapper),stnButtonWrapper=null)}function messageHandle(){chrome.runtime.onMessage.addListener((function(e,t,n){if(e.updateNote){switch(e.updateNote.noteChange.type){case-2:removeAllNotes();break;case-1:removeNoteSync(e.updateNote.noteChange.data);break;case 0:updateNoteSync(e.updateNote.noteChange.data);break;case 1:addNoteSync(e.updateNote.noteChange.data);break;case 2:enableStickyNote(e.updateNote.noteChange.data.enabled,!0)}try{chrome.storage.local.get(["notes"],(function(e){window.storedNotes=JSON.parse(e.notes)}))}catch(e){window.debug&&console.log(e.message)}}else e.restoreNote&&window.location.reload()}))}function loadNotes(){createMenuButton(),(noteContainer=document.getElementById("note-container"))||((noteContainer=document.createElement("div")).id="note-container",document.getElementById("background").appendChild(noteContainer)),window.storedNotes.length&&window.storedNotes.forEach((function(e){new StickyNote(e)}))}function createMenuButton(){stnButtonWrapper=document.createElement("li"),(stnButton=document.createElement("a")).className="new-note-button",stnButton.innerHTML=window.storedNotes.length>0?"&#128465; Clear Notes":"+ New note",stnButton.addEventListener("click",(function(e){e.preventDefault(),window.storedNotes.length>0?swal({title:"",text:"Do you want to remove all notes ?",type:"warning",html:!1,animation:!1,showConfirmButton:!0,confirmButtonColor:"#DD6B55",confirmButtonText:"Yes",showCancelButton:!0,cancelButtonText:"No",closeOnConfirm:!0,closeOnCancel:!0},(function(e){e&&(removeAllNotes(),syncNote(-2,{}))})):(syncNote(1,new StickyNote(null,!0).noteToSave),stnButton.innerHTML="&#128465; Clear Notes")})),stnButtonWrapper.appendChild(stnButton),document.getElementById("footermenu").appendChild(stnButtonWrapper)}function onLoad(){chrome.storage.local.get(["enable_note","notes"],(function(e){var t=e.enable_note,n=e.notes;if(n)try{window.storedNotes=JSON.parse(n)}catch(t){window.storedNotes=[]}footer=document.getElementById("footer"),t&&"yes"===t&&loadNotes(),messageHandle()}))}StickyNote.prototype.remove=function(e){this.note.parentNode.removeChild(this.note)},onLoad();
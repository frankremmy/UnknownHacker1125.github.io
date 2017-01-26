
var navItems = document.getElementsByClassName("main-nav-item");

for (var i = 0; i < navItems.length; i++) {
	
	var item = navItems[i],
		rippleHeight = 7,
		
		rippleCount = Math.floor(window.innerHeight/rippleHeight),
		fragment = document.createDocumentFragment();
	
	for(var j = 0; j < rippleCount; j++){
		var ripple = document.createElement("div");
		ripple.className += " ripple";
		fragment.appendChild(ripple);
		ripple.style.top = j * rippleHeight + "px";
		ripple.style.webkitAnimationDelay = (j/100) + "s";
	}

	item.appendChild(fragment);

};
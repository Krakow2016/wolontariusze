/**
 * Created by janek on 23.03.17.
 */
window.onload = function(){

	let why = document.getElementById("why");
	let nav = document.getElementById("nav");
	let originClass = "main-nav ";
	let newClass = "scrolled";
	let navChange = false;
	let target;

	let toggleButtons = document.querySelectorAll(".toggle-button, #nav .list-element");
	let openPane = false;
	var btn;
	
	for(var i=0; i<toggleButtons.length; i++){
		btn = toggleButtons[i];
		btn.addEventListener("click", () => {
			nav.className = openPane ? nav.className.replace(/(?:^|\s)open(?!\S)/g, '') : nav.className + " open";
			openPane = !openPane;
		})
	}

	smoothScroll.init({
		offset: nav.offsetHeight < 100 ? 50 : 0
	});
	gumshoe.init({
		offset: nav.offsetHeight < 100 ? 50 : 0
	});

	window.addEventListener("scroll", ()=>{
		target = gumshoe.getCurrentNav().target;
		if(target.id != "header" && !navChange){
			nav.className = originClass + newClass;
			navChange = !navChange;
		}else if(target.id == "header" && navChange){
			nav.className = originClass;
			navChange = !navChange;
		}
	});
};
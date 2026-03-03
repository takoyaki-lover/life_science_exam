const modal = document.getElementById("image-modal");
const modalInner = document.getElementById("modal-inner");
const modalImg = document.getElementById("modal-inner-image");

// 画像クリックで表示
document.querySelectorAll("img").forEach(img => {
	img.addEventListener("click", (event) => {
		modalImg.src = img.src;
		modal.style.display = "flex"; // 表示ON
		event.stopPropagation();
	})
})

// モーダルクリックで閉じる
if (modalInner) {
	modalInner.addEventListener("click", () => {
		modal.style.display = "none";
	})
}


// ドラッグバー
const dragBar = document.getElementById("drag-bar");

// スマホやタブレットのときはドラッグバーを表示させない
let isSmartPhone = navigator.userAgent.match(/iPhone|iPad|Android.+Mobile/);
if (isSmartPhone) {
	dragBar.style.display = "none";
	document.documentElement.style.setProperty("--drag-bar-height", "0px");
}

let isDragging = false;

if (dragBar && !isSmartPhone) {
	// ドラッグバーを押したとき
	dragBar.addEventListener("mousedown", function (e) {
		e.preventDefault();
		isDragging = true;
		document.body.style.cursor = "row-resize";
		document.body.style.userSelect = "none";
	})

	// ドラッグしたとき
	document.addEventListener("mousemove", function (e) {
		if (isDragging) {
			let offsetTop = modal.getBoundingClientRect().top;
			let offsetHeight = dragBar.getBoundingClientRect().height / 2;
			let newHeight = e.clientY - offsetTop + offsetHeight;
			modal.style.height = newHeight + "px";
		}
	})

	// ドラッグバーを離したとき
	document.addEventListener("mouseup", function (e) {
		if (isDragging) {
			isDragging = false;
			document.body.style.cursor = "auto";
			document.body.style.userSelect = "auto";
		}
	})
}
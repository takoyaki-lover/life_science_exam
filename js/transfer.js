// exam-num クラス配列取得
const exam_num = document.querySelectorAll(".exam-num");

let total = 3;

// 小テスト変更
exam_num.forEach(function (exam_num) {
	let html = "";
	for (let i = 0; i <= total; i++) {
		html += `<option value="${i}">${i != 0 ? "第"+i+"回" : "ホーム"}</option>`
	}
	exam_num.insertAdjacentHTML("beforeend", html);

	exam_num.addEventListener("change", function () {
		num = exam_num.value;
		if (num != 0) {
			location.href = `./${num}.html`;
		}
		else {
			location.href = "./home.html";
		}
	})
	exam_num.options[num].selected = true;
})


// 第何回目表示
if (num != 0) {
	document.getElementById("page-title").textContent += ` 第${num}回`;
	document.getElementById("top").textContent += ` 第${num}回`;
}
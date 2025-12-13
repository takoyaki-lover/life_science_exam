// 現在の小テスト番号を取得
let num = document.getElementById("exam-num").value;


// 小テスト変更
document.getElementById("exam-num").addEventListener("change", function() {
	num = document.getElementById("exam-num").value;
	if (num != 0) {
		location.href = `./life_science_exam_${num}.html`;
	}
	else {
		location.href = "./home.html"
	}
})

document.getElementById("exam-num1").addEventListener("change", function() {
	num = document.getElementById("exam-num1").value;
	if (num != 0) {
		location.href = `./life_science_exam_${num}.html`;
	}
	else {
		location.href = "./home.html"
	}
})

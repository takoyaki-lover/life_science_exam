// ================================
// 描画関数
// ================================
function loadQuiz() {
	const container = document.getElementById("quiz-container");

	quizSections.forEach((section, sIndex) => {
		let html = `
			<div class="section">
				<h2 class="section-title level-3">問題${sIndex + 1}．${section.title}</h2>
		`;

		// 大問画像
		if (section.images && section.images.length > 0) {
			html += `<div class="image-wrap">`;
			section.images.forEach(img => html += `<img src="./exam_${num}/${img}" alt="${img}">`);
			html += `</div>`;
		}

		// 小問がある場合
		if (section.questions && section.questions.length > 0) {
			section.questions.forEach((q, qIndex) => {
				html += renderQuestion(q, sIndex, qIndex, section.choices);
			});
		}
		// 小問なしの場合は大問単独問題として描画
		else {
			html += renderQuestion(section, sIndex, 0, section.choices, true); // trueでtextなし扱い
		}
		html += `</div>`

		container.insertAdjacentHTML("beforeend", html);
	});

	container.insertAdjacentHTML("beforeend", `
		<div class="total-result-area">
			<button class="btn btn-check level-5" onclick="checkAnswers()">採点する</button>
			<h2 class="score level-2">点数: <span id="score"></span></h2>
		</div>
		<div class="btn-area">
			<button class="btn btn-close level-5" id="close" onclick="closeAnswers()">結果を閉じる</button>
			<button class="btn btn-uncheck level-5" id="uncheck" onclick="uncheck()">チェックを全て外す</button>
		</div>

	`);
}


// 問題描画
function renderQuestion(q, sIndex, qIndex, parentChoices, noText = false) {
	const choices = q.choices || parentChoices;
	let html = `<div class="question">`;

	// textがある場合のみ問題文を表示
	if (!noText && q.text) {
		html += `<p class="question-title level-4">問${sIndex + 1}-${qIndex + 1}．${q.text}</p>`;
	}

	if (!noText && q.images) {
		html += `<div class="image-wrap">`;
		q.images.forEach(img => html += `<img src="./exam_${num}/${img}" alt="${img}">`);
		html += `</div>`;
	}

	html += `<div class="radio-area">`;
	choices.forEach((choice, cIndex) => {
		html += `
			<div class="radio-wrap">
				<input type="radio" name="${sIndex}-${qIndex}" id="${sIndex}-${qIndex}-${cIndex}" value="${cIndex}" onclick="check()">
				<label for="${sIndex}-${qIndex}-${cIndex}" class="radio-label level-4">
					<span>${choice}</span>
				</label>
			</div>
		`;
	});

	html += `
			</div>
		</div>
		<p class="result level-4"><span id="${sIndex}-${qIndex}-judge"></span> <span id="${sIndex}-${qIndex}-text"></span></p>
	`;
	return html;
}


// チェックを押したとき
function check() {
	const sections = document.querySelectorAll(".section");
	let tf = false;

	sections.forEach((section, sIndex) => {
		const questions = section.querySelectorAll(".question");
		questions.forEach((question, qIndex) => {
			const inputs = question.querySelectorAll("input");
			inputs.forEach((input, iIndex) => {
				document.querySelector(`label[for="${sIndex}-${qIndex}-${iIndex}"]`).classList.remove("selected");
			})
			const selected = document.querySelector(`input[name="${sIndex}-${qIndex}"]:checked`);
			if (selected) {
				document.querySelector(`label[for="${sIndex}-${qIndex}-${selected.value}"]`).classList.add("selected");
				tf = true;
			}
		})
	})
	if (!tf) {
		uncheckBtn.disabled = true;
	} else {
		uncheckBtn.disabled = false;
	}

	// quizSections[num - 1].forEach((section, sIndex) => {
	// 	const questionList = section.questions && section.questions.length > 0 ? section.questions : [section];

	// 	questionList.forEach((q, qIndex) => {
	// 		const choices = q.choices || section.choices;
	// 		for (let i = 0; i < choices.length; i++) {
	// 			document.querySelector(`label[for="${sIndex}-${qIndex}-${i}"]`).classList.remove("selected");
	// 		}

	// 		const selected = document.querySelector(`input[name="${sIndex}-${qIndex}"]:checked`);
	// 		if (selected) {
	// 			document.querySelector(`label[for="${sIndex}-${qIndex}-${selected.value}"]`).classList.add("selected");
	// 		}
	// 	})
	// })
}


// ================================
// 採点
// ================================
function checkAnswers() {
	let score = 0;
	let total = 0;

	quizSections.forEach((section, sIndex) => {
		// 小問がある場合とない場合で配列化
		const questionList = section.questions && section.questions.length > 0 ? section.questions : [section];

		questionList.forEach((q, qIndex) => {
			total += 1;
			const selected = document.querySelector(`input[name="${sIndex}-${qIndex}"]:checked`);
			const choices = q.choices || section.choices;
			const correctAnswerLabel = document.querySelector(`label[for="${sIndex}-${qIndex}-${q.answer}"]`);
			const judge = document.getElementById(`${sIndex}-${qIndex}-judge`);
			const correctAnswerText = document.getElementById(`${sIndex}-${qIndex}-text`);

			if (selected) {
				if (Number(selected.value) === q.answer) { // 正解のとき
					score += 1;
					correctAnswerLabel.classList.add("iscorrect");
					correctAnswerLabel.classList.remove("correct-answer");
					judge.classList.add("correct-color");
					judge.classList.remove("wrong-color");
					judge.textContent = `正解！`;
					correctAnswerText.textContent = "";
				} else { // 不正解のとき
					document.querySelector(`label[for="${sIndex}-${qIndex}-${selected.value}"]`).classList.remove("iscorrect");
					correctAnswerLabel.classList.add("correct-answer");
					correctAnswerLabel.classList.remove("iscorrect");
					judge.classList.add("wrong-color");
					judge.classList.remove("correct-color");
					judge.textContent = `不正解`;
					correctAnswerText.textContent = `(正解： "${choices[q.answer]}")`;
				}
			} else { // 選ばれていないとき
				correctAnswerLabel.classList.add("correct-answer");
				correctAnswerLabel.classList.remove("iscorrect");
				judge.classList.add("wrong-color");
				judge.classList.remove("correct-color");
				judge.textContent = `未回答`;
				correctAnswerText.textContent = `(正解： "${choices[q.answer]}")`;
			}
		});
	});
	document.getElementById("score").textContent = `${score} / ${total}`;

	closeBtn.disabled = false;
}


// 採点結果を閉じる
function closeAnswers() {
	const sections = document.querySelectorAll(".section");
	sections.forEach((section, sIndex) => {
		const questions = section.querySelectorAll(".question");
		questions.forEach((question, qIndex) => {
			const judge = document.getElementById(`${sIndex}-${qIndex}-judge`);
			const correctAnswerText = document.getElementById(`${sIndex}-${qIndex}-text`);
			judge.classList.remove("correct-color", "wrong-color");
			judge.textContent = "回答中";
			correctAnswerText.textContent = "([採点する]を押すと正誤判定されます)";

			let inputs = question.querySelectorAll("input");
			inputs.forEach((input, iIndex) => {
				document.querySelector(`label[for="${sIndex}-${qIndex}-${iIndex}"]`).classList.remove("iscorrect", "correct-answer");
			})
		})
	})
	document.getElementById("score").textContent = "未採点";

	closeBtn.disabled = true;

	// quizSections[num - 1].forEach((section, sIndex) => {
	// 	// 小問がある場合とない場合で配列化
	// 	const questionList = section.questions && section.questions.length > 0 ? section.questions : [section];

	// 	questionList.forEach((q, qIndex) => {
	// 		const selected = document.querySelector(`input[name="${sIndex}-${qIndex}"]:checked`);
	// 		if (selected) {
	// 			document.querySelector(`label[for="${sIndex}-${qIndex}-${selected.value}"]`).classList.remove("iscorrect");
	// 		}
	// 		const choices = q.choices || section.choices;
	// 		choices.forEach((choice, cIndex) => {
	// 			document.querySelector(`label[for="${sIndex}-${qIndex}-${cIndex}"]`).classList.remove("correct-answer");
	// 		})
	// 		const judge = document.getElementById(`${sIndex}-${qIndex}-judge`);
	// 		const correctAnswerText = document.getElementById(`${sIndex}-${qIndex}-text`);
	// 		judge.classList.remove("wrong-color");
	// 		judge.classList.remove("correct-color");
	// 		judge.textContent = "回答中";
	// 		correctAnswerText.textContent = "([採点する]を押すと正誤判定されます)";
	// 	});
	// });
}


// 全てのチェックを外す
function uncheck() {
	closeAnswers();

	const sections = document.querySelectorAll(".section");
	sections.forEach((section, sIndex) => {
		const questions = section.querySelectorAll(".question");
		questions.forEach((question, qIndex) => {
			const inputs = question.querySelectorAll("input");
			inputs.forEach((input, iIndex) => {
				document.querySelector(`input[name="${sIndex}-${qIndex}"][value="${iIndex}"]`).checked = false;
				document.querySelector(`label[for="${sIndex}-${qIndex}-${iIndex}"]`).classList.remove("selected");
			})
		})
	})

	uncheckBtn.disabled = true;

	// quizSections[num - 1].forEach((section, sIndex) => {
	// 	const questionList = section.questions && section.questions.length > 0 ? section.questions : [section];
	// 	questionList.forEach((q, qIndex) => {
	// 		const choices = q.choices || section.choices;
	// 		choices.forEach((choice, cIndex) => {
	// 			document.querySelector(`input[name="${sIndex}-${qIndex}"][value="${cIndex}"]`).checked = false;
	// 		})
	// 		for (let i = 0; i < choices.length; i++) {
	// 			document.querySelector(`label[for="${sIndex}-${qIndex}-${i}"]`).classList.remove("selected");
	// 		}
	// 	})
	// })
}


// // ================================
// // 画像クリックで拡大表示（上半分）
// // ================================

// // 画面上半分のモーダル（半透明）
// const modal = document.createElement("div");
// modal.id = "image-modal";
// modal.title = "クリックして閉じる"
// modal.style.position = "fixed";
// modal.style.top = "0";
// modal.style.left = "0";
// modal.style.width = "100%";
// modal.style.height = "45%";
// modal.style.background = "rgba(0,0,0,0.5)";
// modal.style.display = "none";
// modal.style.zIndex = "9999";
// modal.style.cursor = "pointer";
// modal.style.justifyContent = "center";
// modal.style.alignItems = "center";
// document.body.appendChild(modal);

// // 画像本体
// const modalImg = document.createElement("img");
// modalImg.style.maxWidth = "100%"
// modalImg.style.height = "100%"
// modalImg.style.objectFit = "contain";
// modalImg.style.pointerEvents = "none";
// modal.appendChild(modalImg);

// // クリックで閉じる
// modal.addEventListener("click", () => {
// 	modal.style.display = "none";
// });

// // サムネイルクリックで表示
// function enableImageZoom() {
// 	document.querySelectorAll("img").forEach(img => {
// 		img.title = "クリックして拡大表示する";
// 		img.addEventListener("click", (event) => {
// 			modalImg.src = img.src;
// 			modal.style.display = "flex"; // 表示ON
// 			event.stopPropagation();
// 		});
// 	});
// }


// 初期表示
loadQuiz();
const uncheckBtn = document.getElementById("uncheck");
const closeBtn = document.getElementById("close");
closeAnswers();
// enableImageZoom();

check();
// let tf = false;
// const sections = document.querySelectorAll(".section");
// sections.forEach((section, sIndex) => {
// 	let questions = section.querySelectorAll(".question");
// 	questions.forEach((question, qIndex) => {
// 		const selected = document.querySelector(`input[name="${sIndex}-${qIndex}"]:checked`);
// 		if (selected) {
// 			tf = true;
// 		}
// 	})
// })
// if (!tf) {
// 	uncheckBtn.disabled = true;
// }
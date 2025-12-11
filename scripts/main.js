// ================================
// 描画関数
// ================================
function loadQuiz() {
	const container = document.getElementById("quiz-container");
	container.innerHTML = "";

	quizSections.forEach((section, sIndex) => {
		const secDiv = document.createElement("div");
		secDiv.className = "section";

		let html = `<h2>${section.title}</h2>`;

		// 大問画像
		if (section.images && section.images.length > 0) {
			html += `<div class="section-images">`;
			section.images.forEach(img => html += `<img src="./exam_${num}/${img}" alt="大問画像" title="クリックして拡大表示する">`);
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

		secDiv.innerHTML = html;
		container.appendChild(secDiv);
	});
}

// 問題描画
function renderQuestion(q, sIndex, qIndex, parentChoices, noText=false) {
	const choices = q.choices || parentChoices;
	let html = `<div class="question">`;

	// textがある場合のみ問題文を表示
	if (!noText && q.text) {
		html += `<p><strong>Q${sIndex + 1}-${qIndex + 1}. ${q.text}</strong></p>`;
	}

	if (q.img) html += `<img src="${q.img}" alt="問題画像" title="クリックして拡大表示する">`;

	choices.forEach((choice, cIndex) => {
		html += `
		<label>
			<input type="radio" name="s${sIndex}-q${qIndex}" value="${cIndex}">
			${choice}
		</label><br>`;
	});

	html += `<div id="result-s${sIndex}-q${qIndex}" class="result"></div>`;
	html += `</div>`;
	return html;
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
			total++;
			const selected = document.querySelector(`input[name="s${sIndex}-q${qIndex}"]:checked`);
			const resultDiv = document.getElementById(`result-s${sIndex}-q${qIndex}`);
			const choices = q.choices || section.choices;

			if (!selected) {
				resultDiv.innerHTML = `<span class="wrong">未回答</span>（正解：${choices[q.answer]}）`;
				return;
			}

			if (Number(selected.value) === q.answer) {
				score++;
				resultDiv.innerHTML = `<span class="correct">正解！</span>`;
			} else {
				resultDiv.innerHTML = `<span class="wrong">不正解</span>（正解：${choices[q.answer]}）`;
			}
		});
	});

	document.getElementById("score").textContent = `${score} / ${total}`;
}


// ================================
// 画像クリックで拡大表示（上半分）
// ================================

// 画面上半分のモーダル（半透明）
const modal = document.createElement("div");
modal.id = "image-modal";
modal.title = "クリックして閉じる"
modal.style.position = "fixed";
modal.style.top = "0";
modal.style.left = "0";
modal.style.width = "100%";
modal.style.height = "45%";
modal.style.background = "rgba(0,0,0,0.5)";
modal.style.display = "none";
modal.style.zIndex = "9999";
modal.style.cursor = "pointer";
modal.style.justifyContent = "center";
modal.style.alignItems = "center";
document.body.appendChild(modal);

// 画像本体
const modalImg = document.createElement("img");
modalImg.style.maxWidth = "100%"
modalImg.style.height = "100%"
modalImg.style.objectFit = "contain";
modalImg.style.pointerEvents = "none";
modal.appendChild(modalImg);

// クリックで閉じる
modal.addEventListener("click", () => {
    modal.style.display = "none";
});

// サムネイルクリックで表示
function enableImageZoom() {
    document.querySelectorAll("img").forEach(img => {
        img.style.cursor = "pointer";
        img.addEventListener("click", (event) => {
            modalImg.src = img.src;
            modal.style.display = "flex"; // 表示ON
            event.stopPropagation();
        });
    });
}

// 初期表示
loadQuiz();
enableImageZoom();

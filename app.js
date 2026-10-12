	const $ = (s, r = document) => r.querySelector(s)
		const $$ = (s, r = document) => [...r.querySelectorAll(s)]
		const cap = s => s.charAt(0).toUpperCase() + s.slice(1)
		const T = (en, uz) => `<span class="en">${en}</span><span class="uz">${uz}</span>`
		const TR = (en, uz) => `${en}<span class="tr">${uz}</span>`
		const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[b[i], b[j]] = [b[j], b[i]] } return b }

		/* ============ Navigation & language ============ */
		const stage = $('#stage'), slides = $$('.slide'), total = slides.length
		let cur = 0
		$('#dots').innerHTML = slides.map((_, i) => `<button class="dot" aria-label="Slide ${i + 1}" data-i="${i}"></button>`).join('')
		$$('.dot').forEach(d => d.addEventListener('click', () => go(+d.dataset.i)))
		function go(n) {
			cur = Math.max(0, Math.min(total - 1, n))
			slides.forEach((s, i) => { s.classList.toggle('active', i === cur); s.classList.toggle('past', i < cur); s.setAttribute('aria-hidden', i !== cur) })
			$('#progress').style.width = ((cur + 1) / total * 100) + '%'
			$('#counter').innerHTML = T(`Slide ${cur + 1} of ${total}`, `${cur + 1} / ${total}-slayd`)
			$$('.dot').forEach((d, i) => d.classList.toggle('on', i === cur))
			$('#prev').disabled = cur === 0; $('#next').disabled = cur === total - 1
		}
		$('#prev').addEventListener('click', () => go(cur - 1))
		$('#next').addEventListener('click', () => go(cur + 1))
		$('#startBtn').addEventListener('click', () => go(1))
		$('#toGame').addEventListener('click', () => go(8))
		$$('.lang button').forEach(b => b.addEventListener('click', () => {
			document.body.dataset.lang = b.dataset.l; $$
				('.lang button').forEach(x => x.classList.toggle('on', x === b))
		}))
		document.addEventListener('keydown', e => {
			if (e.target.tagName === 'INPUT') return
			if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1) }
			else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1) }
			else if (e.key === 'Home') go(0); else if (e.key === 'End') go(total - 1)
		})
		function fit() { const s = Math.min(innerWidth / 1280, innerHeight / 720) * 0.97; stage.style.transform = `translate(-50%,-50%) scale(${s})` }
		addEventListener('resize', fit); fit()

		/* ============ Slide 1: room scene + sentence ticker ============ */
		const ROOM = [
			{ ic: 'fa-couch', en: 'There is a couch in the room.', uz: 'Xonada divan bor.' },
			{ ic: 'fa-lightbulb', en: 'There is a lamp on the table.', uz: 'Stol ustida chiroq bor.' },
			{ ic: 'fa-book', en: 'There are some books on the shelf.', uz: 'Javonda bir nechta kitob bor.' },
			{ ic: 'fa-cat', en: 'There is something under the chair.', uz: 'Stul ostida biror narsa bor.' },
			{ ic: 'fa-seedling', en: 'There is somebody in the garden.', uz: 'Bogʻda kimdir bor.' }
		]
		$('#roomGrid').innerHTML = ROOM.map(r => `<div class="rtile"><i class="fa-solid ${r.ic}"></i></div>`).join('')
		let ri = 0
		function roomTick() {
			$$('.rtile').forEach((t, i) => t.classList.toggle('on', i === ri))
			$$('.tkEn').forEach(e => e.textContent = ROOM[ri].en); $$
				('.tkUz').forEach(e => e.textContent = ROOM[ri].uz)
			ri = (ri + 1) % ROOM.length
		}
		roomTick(); setInterval(roomTick, 2800)

		/* ============ Slide 2: flip cards (Topic 1) ============ */
		const uses1 = [
			{
				i: 'fa-cube', t: `There is<span class="tr">bor (bitta)</span>`, d: T('One thing, or something you cannot count.', "Bitta narsa yoki sanab bo'lmaydigan narsa."),
				ex: [TR('<mark>There is</mark> a cat in the room.', 'Xonada mushuk bor.'), TR('<mark>There is</mark> some milk.', 'Ozgina sut bor.')]
			},
			{
				i: 'fa-cubes', t: `There are<span class="tr">bor (ko'p)</span>`, d: T('Two or more things you can count.', "Ikki yoki undan ko'p, sanaladigan narsalar."),
				ex: [TR('<mark>There are</mark> two cats.', 'Ikkita mushuk bor.'), TR('<mark>There are</mark> some books.', 'Bir nechta kitob bor.')]
			},
			{
				i: 'fa-circle-question', t: `Questions<span class="tr">Savollar</span>`, d: T('Is there...? / Are there...?', 'Borishini soʻrash.'),
				ex: [TR('<mark>Is there</mark> a cat?', 'Mushuk bormi?'), TR('<mark>Are there</mark> any books?', 'Kitoblar bormi?')]
			}
		]
		$('#flips1').innerHTML = uses1.map(u => `
  <button class="flip" aria-pressed="false">
    <span class="flip-in">
      <span class="face"><span class="ico"><i class="fa-solid ${u.i}"></i></span><h3>${u.t}</h3><span class="desc">${u.d}</span>
        <span class="hint"><i class="fa-solid fa-rotate"></i>${T('Examples', 'Misollar')}</span></span>
      <span class="face back"><span class="lbl">${T('Examples', 'Misollar')}</span><span class="ex">${u.ex.map(e => `<span class="exl">${e}</span>`).join('')}</span></span>
    </span>
  </button>`).join('')
		$$('.flip').forEach(f => f.addEventListener('click', () => f.setAttribute('aria-pressed', f.classList.toggle('on'))))

		/* ============ Slide 3: sentence builder ============ */
		const THINGS = [
			{ w: 'cat', t: 's', art: 'a', u: 'mushuk' }, { w: 'apple', t: 's', art: 'an', u: 'olma' },
			{ w: 'books', t: 'p', u: 'kitoblar' }, { w: 'chairs', t: 'p', u: 'stullar' },
			{ w: 'water', t: 'u', u: 'suv' }, { w: 'milk', t: 'u', u: 'sut' }
		]
		const PLACES = [
			['on the table', 'stol ustida'], ['in the bag', 'sumkada'], ['in the room', 'xonada'],
			['under the bed', 'karavot ostida'], ['in the fridge', 'muzlatgichda']
		]
		const DEF = { aff: ['books', 'on the table'], neg: ['water', 'in the fridge'], int: ['cat', 'in the room'] }
		let form = 'aff', thing = 'books', place = 'on the table'
		const chip = (c, t) => `<span class="chip ${c}">${t}</span>`
		const plus = '<span class="plus">+</span>'
		$('#thingPick').innerHTML = THINGS.map(t => `<button class="opt" data-s="${t.w}">${t.w}<span class="tr">${t.u}</span></button>`).join('')
		$('#placePick').innerHTML = PLACES.map(([p, u]) => `<button class="opt" data-v="${p}">${p}<span class="tr">${u}</span></button>`).join('')

		function renderS3() {
			const th = THINGS.find(x => x.w === thing), be = th.t === 'p' ? 'are' : 'is'
			const detAff = th.t === 's' ? th.art : 'some', detQ = th.t === 's' ? th.art : 'any'
			const cThere = chip('c-subj', 'There'), cBe = chip('c-aux', `is / are<span class="tr">bor</span>`),
				cDet = chip('c-det', `a / some / any<span class="tr">miqdor</span>`), cN = chip('c-n', `noun<span class="tr">ot</span>`), cPl = chip('c-pl', `place<span class="tr">joy</span>`)
			const F = {
				aff: [cThere, plus, cBe, plus, cDet, plus, cN, plus, cPl],
				neg: [cThere, plus, chip('c-not', `isn't / aren't<span class="tr">yo'q</span>`), plus, cDet, plus, cN, plus, cPl],
				int: [chip('c-aux', `Is / Are<span class="tr">bor</span>`), plus, cThere.replace('There', 'there'), plus, cDet, plus, cN, plus, cPl, chip('c-q', '?')]
			}
			$('#formula').innerHTML = F[form].join('')
			let html, short
			if (form === 'aff') {
				html = chip('c-subj', 'There') + chip('c-aux', be) + chip('c-det', detAff) + chip('c-n', th.w) + chip('c-pl', place) + '<span class="p">.</span>'
				short = th.t === 'p'
					? T('<b>There are</b> has no short form.', "<b>There are</b> ning qisqa shakli yo'q.")
					: T(`Short form: <b>There's ${detAff} ${th.w} ${place}.</b>`, `Qisqa shakli: <b>There's ${detAff} ${th.w} ${place}.</b>`)
			} else if (form === 'neg') {
				html = chip('c-subj', 'There') + chip('c-not', be === 'is' ? "isn't" : "aren't") + chip('c-det', detQ) + chip('c-n', th.w) + chip('c-pl', place) + '<span class="p">.</span>'
				short = T(`Or with no: <b>There ${be} no ${th.w} ${place}.</b>`, `Yoki no bilan: <b>There ${be} no ${th.w} ${place}.</b>`)
			} else {
				html = chip('c-aux', cap(be)) + chip('c-subj', 'there') + chip('c-det', detQ) + chip('c-n', th.w) + chip('c-pl', place) + '<span class="p">?</span>'
				const sa = `Yes, there ${be}. / No, there ${be === 'is' ? "isn't" : "aren't"}.`
				short = T(`Short answer: <b>${sa}</b>`, `Qisqa javob: <b>${sa}</b>`)
			}
			$('#liveSentence').innerHTML = html; $('#liveShort').innerHTML = short; $$('.tab').forEach(t => { const on = t.dataset.f === form; t.classList.toggle('on', on); t.setAttribute('aria-selected', on) })
			$$('#thingPick .opt').forEach(b => b.classList.toggle('on', b.dataset.s === thing)); $$
				('#placePick .opt').forEach(b => b.classList.toggle('on', b.dataset.v === place))
			$$('#who span').forEach(s => s.classList.toggle('cur', s.dataset.a === be))
		} $$
			('.tab').forEach(t => t.addEventListener('click', () => { form = t.dataset.f;[thing, place] = DEF[form]; renderS3() }))
		$$('#thingPick .opt').forEach(b => b.addEventListener('click', () => { thing = b.dataset.s; renderS3() })); $$
			('#placePick .opt').forEach(b => b.addEventListener('click', () => { place = b.dataset.v; renderS3() }))
		renderS3()

		/* ============ Slide 4: some / any / no (Topic 2) ============ */
		const RULES = [
			{ n: T('Yes sentences (+)', 'Tasdiq gaplar (+)'), t: `some<span class="tr">bir nechta, ozgina</span>`, d: T('Use some with plural and uncountable nouns.', "Some ko'plik va sanalmaydigan otlar bilan ishlatiladi."), ex: ['There are <b>some</b> apples.', 'There is <b>some</b> milk.'] },
			{ n: T('No (−) and questions (?)', 'Inkor (−) va savol (?)'), t: `any<span class="tr">hech, biror</span>`, d: T('Use any when the sentence is negative or a question.', "Gap inkor yoki savol bo'lsa, any ishlatiladi."), ex: ["There aren't <b>any</b> apples.", 'Is there <b>any</b> milk?'] },
			{ n: T('Means: not any', "Ma'nosi: not any"), t: `no<span class="tr">yo'q</span>`, d: T('no = not any. The verb stays positive.', "no = not any. Fe'l tasdiq shaklida qoladi."), ex: ['There are <b>no</b> apples.', 'There is <b>no</b> milk.'] },
			{ n: T('One thing', 'Bitta narsa'), t: `a / an<span class="tr">bitta</span>`, d: T('Use a for one thing. Use an before a, e, i, o, u.', "Bitta narsa uchun a. Unli (a, e, i, o, u) oldida an."), ex: ['There is <b>a</b> cat.', 'There is <b>an</b> apple.'] }
		]
		$('#rules').innerHTML = RULES.map(r => `
  <article class="rule">
    <div class="rule-top"><div class="n">${r.n}</div><h3>${r.t}</h3></div>
    <div class="rule-body"><p>${r.d}</p>${r.ex.map(e => `<div class="ex-row">${e}</div>`).join('')}</div>
  </article>`).join('')

		const UNC = ['water', 'milk', 'rice', 'bread', 'sugar', 'juice', 'money', 'tea', 'coffee', 'food', 'salt']
		const IRR = ['children', 'people', 'men', 'women']
		function nounForms(raw) {
			const w = raw.trim().toLowerCase()
			if (!/^[a-z]+$/.test(w)) return null
			const type = UNC.includes(w) ? 'u' : (IRR.includes(w) || (/s$/.test(w) && !/(ss\vert{}us\vert{}is)$/.test(w))) ? 'p' : 's'
			if (type === 'p') return { pos: `There are some ${w}.`, neg: `There aren't any ${w}.`, q: `Are there any ${w}?`, why: T('Plural → There are some / any', "Ko'plik → There are some / any") }
			if (type === 'u') return { pos: `There is some ${w}.`, neg: `There isn't any ${w}.`, q: `Is there any ${w}?`, why: T('Uncountable → There is some / any', "Sanalmaydigan → There is some / any") }
			const art = /^[aeiou]/.test(w) ? 'an' : 'a'
			return { pos: `There is ${art} ${w}.`, neg: `There isn't ${art} ${w}.`, q: `Is there ${art} ${w}?`, why: T('One thing → There is a / an', 'Bitta narsa → There is a / an') }
		}
		const tryDefault = `<span>${T('Type a noun to see the sentences.', "Ot yozing, gaplarni ko'ring.")}</span>`
		$('#tryOut').innerHTML = tryDefault
		$('#tryIn').addEventListener('input', e => {
			const v = e.target.value.trim(), out = $('#tryOut')
			if (!v) { out.innerHTML = tryDefault; return }
			const r = nounForms(v)
			if (!r) { out.innerHTML = `<span>${T('Use letters only, one noun.', 'Faqat harf, bitta ot yozing.')}</span>`; return }
			out.innerHTML = `<div class="tryres"><span class="big">+ ${r.pos}</span><span class="small">− ${r.neg} &nbsp; ? ${r.q}</span><span class="why">${r.why}</span></div>`
		})

		/* ============ Slide 5: something / somebody / somewhere (Topic 3) ============ */
		const RULEB = [
			T('some- is for yes (+) sentences.', 'some- tasdiq (+) gaplarda ishlatiladi.'),
			T('any- is for no (−) sentences and questions (?).', 'any- inkor (−) va savol (?) gaplarda ishlatiladi.'),
			T('no- means "not any". The verb stays positive.', 'no- "not any" degani. Fe\'l tasdiq shaklida qoladi.')
		]
		const SIGNALS = [
			{ w: 'something', u: 'biror narsa', g: 0, s: 'There is <mark>something</mark> in the box.', t: 'Qutida biror narsa bor.' },
			{ w: 'somebody', u: 'kimdir', g: 0, s: 'There is <mark>somebody</mark> at the door.', t: 'Eshik oldida kimdir bor.' },
			{ w: 'somewhere', u: 'qayerdadir', g: 0, s: 'There is a café <mark>somewhere</mark> near here.', t: 'Shu yaqin atrofda qayerdadir kafe bor.' },
			{ w: 'anything', u: 'biror narsa', g: 1, s: 'Is there <mark>anything</mark> to eat?', t: 'Yeydigan biror narsa bormi?' },
			{ w: 'anybody', u: 'kimdir', g: 1, s: 'Is there <mark>anybody</mark> in the room?', t: 'Xonada kimdir bormi?' },
			{ w: 'anywhere', u: 'hech qayerda', g: 1, s: "There isn't <mark>anywhere</mark> to sit.", t: "O'tirishga hech qayerda joy yo'q." },
			{ w: 'nothing', u: 'hech narsa', g: 2, s: 'There is <mark>nothing</mark> in the bag.', t: "Sumkada hech narsa yo'q." },
			{ w: 'nobody', u: 'hech kim', g: 2, s: 'There is <mark>nobody</mark> at home.', t: "Uyda hech kim yo'q." },
			{ w: 'nowhere', u: 'hech qayerda', g: 2, s: 'There is <mark>nowhere</mark> to park.', t: "To'xtash uchun hech qayer yo'q." }
		]
		$('#cloud').innerHTML = SIGNALS.map((s, i) => `<button class="tag" data-i="${i}">${s.w}<span class="tr">${s.u}</span></button>`).join('')
		function showSignal(i) {
			const s = SIGNALS[i]
			$$('.tag').forEach((t, j) => t.classList.toggle('sel', j === i)); $('#bubble').innerHTML = `<div class="word">${TR(s.w, s.u)}</div><div class="k">${T('Example', 'Misol')}</div><div class="sent">${TR(s.s, s.t)}</div><div class="rulebox">${RULEB[s.g]}</div>`
		}
		$$('.tag').forEach(t => t.addEventListener('click', () => showSignal(+t.dataset.i)))
		showSignal(0)

		/* ============ Slide 6: is or are ============ */
		const UNCN = {
			water: ['suv', 'There is some water in the glass.', 'There are some water in the glass.', 'Stakanda ozgina suv bor.'],
			milk: ['sut', 'There is some milk in the fridge.', 'There are some milk in the fridge.', 'Muzlatgichda ozgina sut bor.'],
			rice: ['guruch', 'There is some rice on the plate.', 'There are some rice on the plate.', 'Tarelkada ozgina guruch bor.'],
			bread: ['non', 'There is some bread on the table.', 'There are some bread on the table.', 'Stol ustida ozgina non bor.'],
			money: ['pul', 'There is some money in my bag.', 'There are some money in my bag.', 'Sumkamda ozgina pul bor.']
		}
		$('#staChips').innerHTML = Object.entries(UNCN).map(([v, d]) => `<button class="vchip s" data-v="${v}">${v}<span class="tr">${d[0]}</span></button>`).join('')
		function showSta(v) {
			const d = UNCN[v]
			$$('.vchip.s').forEach(c => c.classList.toggle('sel', c.dataset.v === v)); $('#badS').textContent = d[2]
			$('#goodS').innerHTML = TR(d[1], d[3])
			$('#cmpNote').innerHTML = v === 'water'
				? T('Tip: count with containers: <b>There are two bottles of water.</b>', "Maslahat: idish bilan sanaladi: <b>There are two bottles of water.</b>")
				: T(`"${v}" is uncountable. Use <b>There is</b>, not There are.`, `"${v}" sanalmaydi. <b>There is</b> ishlating, There are emas.`)
		}
		$$('.vchip.s').forEach(c => c.addEventListener('click', () => showSta(c.dataset.v)))
		showSta('water')

		/* ============ Slide 7: quiz ============ */
		const BL = '<span class="blank">&nbsp;&nbsp;&nbsp;</span>'
		const QUIZ = [
			{ q: `There ${BL} some books on the table.`, t: "Stol ustida bir nechta kitob bor.", o: ['is', 'are', 'be'], a: 1, e: T('Books = plural. Use are.', "Books ko'plik. are ishlating.") },
			{ q: `There isn't ${BL} milk in the fridge.`, t: "Muzlatgichda sut yo'q.", o: ['some', 'any', 'an'], a: 1, e: T('A no (−) sentence: use any.', 'Inkor (−) gapda any ishlatiladi.') },
			{ q: `Is there ${BL} in the box?`, t: 'Qutida biror narsa bormi?', o: ['something', 'anything', 'nothing'], a: 1, e: T('A question: use any- words.', 'Savolda any- so\'zlari ishlatiladi.') },
			{ q: `There is ${BL} at the door. I can hear a voice.`, t: 'Eshik oldida kimdir bor. Men ovoz eshityapman.', o: ['nobody', 'anybody', 'somebody'], a: 2, e: T('A yes (+) sentence: use somebody.', 'Tasdiq (+) gapda somebody ishlatiladi.') }
		]
		let qScore = 0, qDone = 0
		function buildQuiz() {
			qScore = 0; qDone = 0; $('#score').textContent = `0 / ${QUIZ.length}`; $('#qres').classList.remove('show')
			$('#qgrid').innerHTML = QUIZ.map((q, i) => `
    <div class="qcard" data-q="${i}">
      <div class="qtext">${q.q}<span class="tr">${q.t}</span></div>
      <div class="qopts">${q.o.map((o, j) => `<button class="qo" data-j="${j}">${o}</button>`).join('')}</div>
      <div class="qfb" aria-live="polite"></div>
    </div>`).join('')
			$$('.qcard').forEach(card => {
				const q = QUIZ[+card.dataset.q]; $$
					('.qo', card).forEach(btn => btn.addEventListener('click', () => {
						const j = +btn.dataset.j, ok = j === q.a
						$$('.qo', card).forEach(b => b.disabled = true); btn.classList.add(ok ? 'right' : 'wrong'); if (!ok) $$
							('.qo', card)[q.a].classList.add('right')
						const bl = $('.blank', card); bl.textContent = q.o[q.a]; bl.classList.add('ok'); $('.qfb', card).innerHTML = ok
							? `<i class="fa-solid fa-circle-check y"></i> <b class="y">${T('Correct!', "To'g'ri!")}</b> ${q.e}`
							: `<i class="fa-solid fa-circle-xmark n"></i> <b class="n">${T('Not quite.', 'Unday emas.')}</b> ${q.e}`
						if (ok) qScore++; qDone++
						$('#score').textContent = `${qScore} / ${QUIZ.length}`
						if (qDone === QUIZ.length) {
							$('#qresMsg').innerHTML = qScore === QUIZ.length ? T('Perfect! You know it.', 'Ajoyib! Siz buni yaxshi bilasiz.')
								: qScore >= 2 ? T('Good job! Read the tips and try again.', "Yaxshi! Izohlarni o'qib, qayta urinib ko'ring.")
									: T('Keep going. Review the slides and try again.', "Davom eting. Slaydlarni ko'rib chiqib, qayta urinib ko'ring.")
							$('#qres').classList.add('show')
						}
					}))
			})
		}
		$('#qretry').addEventListener('click', buildQuiz)
		buildQuiz()

		/* ============ Slide 8: recap ============ */
		const POINTS = [
			T('<b>There is</b> = singular/uncountable. <b>There are</b> = plural.', "<b>There is</b> = bitta/sanalmaydigan. <b>There are</b> = ko'plik."),
			T('<b>some</b> in yes (+) sentences. <b>any</b> in no (−) & questions (?).', "<b>some</b> tasdiq (+) gaplarda. <b>any</b> inkor (−) va savol (?) gaplarda."),
			T('<b>something, somebody, somewhere</b> → yes. <b>anything…</b> → no / ?.', "<b>something, somebody, somewhere</b> → tasdiq. <b>anything…</b> → inkor/savol."),
			T('<b>no / nothing / nobody / nowhere</b> gives a negative meaning.', "<b>no / nothing / nobody / nowhere</b> inkor ma'no beradi.")
		]
		$('#checks').innerHTML = POINTS.map(p => `<button class="check" aria-pressed="false"><span class="box"><i class="fa-solid fa-check"></i></span><span>${p}</span></button>`).join('')
		function updateRecap() {
			const n = $$('.check.on').length
			$('#recapMsg').innerHTML = n === POINTS.length
				? T('Great job! You are ready.', 'Barakalla! Siz tayyorsiz.')
				: `${n} / ${POINTS.length} <span style="font-size:17px;font-family:Nunito,sans-serif;font-weight:700;color:var(--muted)">${T('Tick what you understand.', 'Tushunganingizni belgilang.')}</span>`
		}
		$$('.check').forEach(c => c.addEventListener('click', () => { c.setAttribute('aria-pressed', c.classList.toggle('on')); updateRecap() }))
		updateRecap()

		/* ============ Slide 9: game ============ */
		const ROUNDS = [
			{ t: 'pick', ic: 'fa-book', q: ['There are some books on the table.', 'There is some books on the table.', 'There are some book on the table.'], u: 'Stol ustida bir nechta kitob bor.' },
			{ t: 'build', ic: 'fa-cat', w: ['There', 'is', 'a', 'cat', 'in', 'the', 'room'], p: '.', u: 'Xonada mushuk bor.' },
			{ t: 'pick', ic: 'fa-glass-water', q: ['There is some water in the glass.', 'There are some water in the glass.', 'There is some waters in the glass.'], u: 'Stakanda ozgina suv bor.' },
			{ t: 'build', ic: 'fa-box-open', w: ['There', 'is', 'something', 'in', 'the', 'box'], p: '.', u: 'Qutida biror narsa bor.' },
			{ t: 'pick', ic: 'fa-house', q: ["There isn't anybody at home.", "There isn't somebody at home.", "There aren't anybody at home."], u: "Uyda hech kim yo'q." },
			{ t: 'build', ic: 'fa-apple-whole', w: ['Are', 'there', 'any', 'apples', 'in', 'the', 'bag'], p: '?', u: 'Sumkada olmalar bormi?' },
			{ t: 'pick', ic: 'fa-chair', q: ['There is nowhere to sit.', "There isn't nowhere to sit.", 'There are nowhere to sit.'], u: "O'tirishga hech qayer yo'q." },
			{ t: 'build', ic: 'fa-egg', w: ['There', 'are', 'no', 'eggs', 'in', 'the', 'fridge'], p: '.', u: "Muzlatgichda tuxum yo'q." }
		]
		let gi = 0, gs = 0
		function gameStart() { gi = 0; gs = 0; renderRound() }
		function setScore() { $('#gRound').textContent = `${Math.min(gi + 1, ROUNDS.length)} / ${ROUNDS.length}`; $('#gScore').textContent = gs }
		function feedback(ok, text, tr) {
			const fb = $('#gFb')
			fb.className = 'gfb ' + (ok ? 'ok' : 'no')
			fb.innerHTML = (ok ? `<i class="fa-solid fa-circle-check"></i> ${T('Correct!', "To'g'ri!")}` : `<i class="fa-solid fa-circle-xmark"></i> ${T('Not quite.', 'Unday emas.')}`) +
				`<div>${text}<span class="tr">${tr}</span></div>`
			if (ok) { gs++; $('#gScore').textContent = gs }
			const nx = $('#gNext'); nx.hidden = false; nx.focus()
		}
		function renderRound() {
			if (gi >= ROUNDS.length) return renderEnd()
			const r = ROUNDS[gi]; setScore()
			$('#gIco').innerHTML = `<i class="fa-solid ${r.ic}"></i>`
			const last = gi === ROUNDS.length - 1
			const nb = `<button class="btn" id="gNext" hidden><span>${T(last ? 'Finish' : 'Next', last ? 'Yakunlash' : 'Keyingi')}</span><i class="fa-solid fa-arrow-right"></i></button>`
			if (r.t === 'pick') {
				const opts = shuffle(r.q.map((s, i) => ({ s, ok: i === 0 })))
				$('#gMain').innerHTML = `<h3 class="gq">${T('Which sentence is correct?', "Qaysi gap to'g'ri?")}</h3>
      <div class="gopts">${opts.map((o, i) => `<button class="gopt" data-i="${i}">${o.s}</button>`).join('')}</div>
      <div class="gfoot"><div class="gfb" id="gFb" aria-live="polite"></div><div class="gbtns">${nb}</div></div>`
				$$('.gopt').forEach(b => b.addEventListener('click', () => {
					const o = opts[+b.dataset.i]; $$
						('.gopt').forEach((x, i) => { x.disabled = true; if (opts[i].ok) x.classList.add('right') })
					if (!o.ok) b.classList.add('wrong')
					feedback(o.ok, r.q[0], r.u)
				}))

			} else {
				const st = { ans: [], tiles: [], locked: false }
				const ids = r.w.map((_, i) => i); let order = shuffle(ids)
				while (order.every((v, i) => v === i)) order = shuffle(ids)
				st.tiles = order
				$('#gMain').innerHTML = `<h3 class="gq">${T('Put the words in order.', "So'zlarni tartibga keltiring.")}</h3>
      <div class="hintline">${r.u}</div>
      <div class="slots" id="slots"></div><div class="tiles" id="tiles"></div>
      <div class="gfoot"><div class="gfb" id="gFb" aria-live="polite"></div>
        <div class="gbtns"><button class="btn btn-ghost" id="gClear"><span>${T('Clear', 'Tozalash')}</span></button>
        <button class="btn" id="gCheck" disabled><span>${T('Check', 'Tekshirish')}</span></button>${nb}</div></div>`
				const draw = () => {
					$('#slots').innerHTML = (st.ans.length ? st.ans.map(id => `<button class="tile" data-id="${id}" ${st.locked ? 'disabled' : ''}>${r.w[id]}</button>`).join('') : `<span class="ph">${T('Tap the words below', "Pastdagi so'zlarni bosing")}</span>`) + `<span class="punct">${r.p}</span>`
					$('#tiles').innerHTML = st.tiles.filter(id => !st.ans.includes(id)).map(id => `<button class="tile" data-id="${id}" ${st.locked ? 'disabled' : ''}>${r.w[id]}</button>`).join('')
					$('#gCheck').disabled = st.locked || st.ans.length !== r.w.length
					$$('#tiles .tile').forEach(b => b.addEventListener('click', () => { st.ans.push(+b.dataset.id); draw() })); $$
						('#slots .tile').forEach(b => b.addEventListener('click', () => { st.ans = st.ans.filter(x => x !== +b.dataset.id); draw() }))
				}
				draw()
				$('#gClear').addEventListener('click', () => { if (!st.locked) { st.ans = []; draw() } })
				$('#gCheck').addEventListener('click', () => {
					st.locked = true; draw(); $('#gClear').disabled = true
					const ok = st.ans.every((id, i) => id === i)
					feedback(ok, r.w.join(' ') + r.p, r.u)
				})
			}
			$('#gNext').addEventListener('click', () => { gi++; renderRound() })
		}
		function renderEnd() {
			setScore()
			const n = ROUNDS.length, stars = gs >= 7 ? 3 : gs >= 5 ? 2 : 1
			$('#gIco').innerHTML = '<i class="fa-solid fa-trophy"></i>'
			const msg = gs >= 7 ? T('Excellent! You really know it.', 'Ajoyib! Siz buni juda yaxshi bilasiz.')
				: gs >= 5 ? T('Good job! Play again to get 3 stars.', "Yaxshi! 3 ta yulduz olish uchun yana o'ynang.")
					: T('Nice try! Review the slides and play again.', "Yaxshi urinish! Slaydlarni takrorlab, yana o'ynang.")
			$('#gMain').innerHTML = `<div class="gend">
    <div class="stars">${[1, 2, 3].map(i => `<i class="fa-solid fa-star ${i <= stars ? 'on' : ''}"></i>`).join('')}</div>
    <h3>${T(`You scored ${gs} /${n}`, `Natija: ${gs} /${n}`)}</h3><p>${msg}</p>
    <div class="gbtns"><button class="btn" id="gAgain"><i class="fa-solid fa-rotate-left"></i><span>${T('Play again', "Qayta o'ynash")}</span></button>
    <button class="btn btn-ghost" id="gHome"><span>${T('Back to start', 'Boshiga qaytish')}</span></button></div></div>`
			$('#gAgain').addEventListener('click', gameStart)
			$('#gHome').addEventListener('click', () => go(0))
		}
		gameStart()

		go(0);
		
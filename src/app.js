document.addEventListener('DOMContentLoaded', initApp)

const ALLOWED_CHARS = ['+', '-', '*', '/', '%']
const MAX_AMOUNT_OF_RESULTS = 10

function initApp() {
	const submitBtn = document.getElementById('submit-btn')
	const form = document.getElementById('main-form')
	const expressionInput = document.getElementById('expression-input')
	const resultsContainer = document.getElementById('results')

	let results = []

	expressionInput.focus()
	form.addEventListener('submit', count)
	submitBtn.addEventListener('click', count)
	resultsContainer.addEventListener('click', (ev) => {
		if (ev.target.tagName !== 'A') {
			return
		}
		const idx = ev.target.dataset.index
		if (typeof idx !== undefined) {
			editResult(idx)
		}
	})

	function fillInput(content, timeout, after) {
		expressionInput.value = content
		expressionInput.focus()
		setTimeout(() => {
			expressionInput.value = after ?? ''
		}, timeout)
	}

	function editResult(index) {
		fillInput('', 0, results[index].expression)
	}

	function count(ev) {
		ev.preventDefault()

		const exp = expressionInput.value
		if (!exp) {
			return false
		}

		const filtered = exp.match(/([\(\)\*\+\-\/\%,0-9]+)/g)
		if (filtered === null) {
			fillInput('Error: Invalid characters!', 2e3)
			return false
		}

		const chars = filtered.join('').split('')
		const opening = chars.filter((i) => i === '(').length
		const closing = chars.filter((i) => i === ')').length

		if (opening !== closing) {
			fillInput('Error: Number of opening bracket is not equal to closing bracket!', 2e3)
			return false
		}

		const expression = chars.join('')
		const value = evaluateExpression(expression)

		results.push({ expression, value })
		resultsContainer.innerHTML = renderResults(results)
		fillInput('', 0)

		return false
	}
}

function evaluateExpression(expression) {
	// @todo
	return expression.split('').join('_')
}

function renderResults(results) {
	const renderItem = (item, index) => `
		<a href="#" data-index=${index}>Edit</a>
		${item.expression} = ${item.value}
	`

	return results.map(renderItem).join('<br/>')
}

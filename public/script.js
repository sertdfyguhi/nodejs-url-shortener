const url = document.getElementById('url')
const a = document.getElementById('output')
const p = document.querySelector('p')

function shorten() {
  const query = new URLSearchParams({ url: url.value }).toString()
  fetch(`/api/shorten?${query}`)
    .then(async res => {
      const data = await res.json()
      p.innerText = res.status != 200 ? data.message : ''
      a.href = res.status == 200 ? data.url : ''
      a.innerText = res.status == 200 ? data.url : ''
    })
}

document.querySelector('button').onclick = shorten
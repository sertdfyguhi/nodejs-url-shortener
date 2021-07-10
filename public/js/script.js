const el = document.getElementById('url')
const a = document.getElementById('output')
const p = document.querySelector('p')

function shorten() {
  const query = new URLSearchParams({ url: el.value }).toString()
  fetch(`/api/shorten?${query}`)
    .then(res => {
      res.json()
        .then(data => {
          if (res.status != 200) {
            p.innerText = data.message
            a.href = ''
            a.innerText = ''
            return }
          
          p.innerText = ''
          a.href = data.url
          a.innerText = data.url
        })
    })
}

document.querySelector('button').onclick = shorten
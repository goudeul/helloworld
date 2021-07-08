const aa = [100, 200, 300]

aa.forEach(function (item) {
  console.log('item: ', item)
})

aa.forEach((item) => {
  console.log('item: ', item)
})

aa.forEach(item => {
  console.log('item: ', item)
})

aa.forEach(item => console.log('item: ', item))

const rr = {
  a: 1,
  b: 2
}

const rrr = {
  ...rr,
  c: 3
}

for (const key in rrr) {
  console.log(key)
}

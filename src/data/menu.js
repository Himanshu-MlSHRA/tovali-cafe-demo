// All prices, hours and dishes are demo content: swap in the client's own.
export const img = (id, size = 960) => `/img/photo-${id}${size ? `-${size}` : ''}.webp`

export const MENU = [
  {
    key: 'coffee',
    label: 'Coffee & Chai',
    items: [
      { name: 'Masala chai', desc: 'Assam tea simmered with ginger, cardamom and clove, milky and strong.', price: '4.20', tag: 'Most ordered', photo: 'f12700779' },
      { name: 'Flat white', desc: 'Double ristretto, silky milk, our house espresso blend.', price: '4.60', photo: 'f95172125' },
      { name: 'Oat latte', desc: 'Espresso with steamed oat milk and a swan on top if we are feeling it.', price: '5.10', tag: 'Vegan', photo: 'f73985481' },
      { name: 'Espresso', desc: 'Pulled short on a bottomless portafilter, served with a glass of water.', price: '3.40', photo: 'm61713028' },
    ],
  },
  {
    key: 'bakes',
    label: 'Bakes & Sweets',
    items: [
      { name: 'Butter croissant', desc: 'Laminated over three days, out of the oven at 7:00 and 11:00.', price: '3.85', tag: 'Fresh at 7am', photo: 'f150900594' },
      { name: 'Pain au chocolat', desc: 'Two batons of dark chocolate in flaky, buttery pastry.', price: '4.35', photo: 'f22852463' },
      { name: 'Cardamom bun', desc: 'Swedish-style knot with pearl sugar and a lot of cardamom.', price: '3.95', photo: 'f81737031' },
      { name: 'Tiramisu slice', desc: 'Espresso-soaked ladyfingers, mascarpone cream, cocoa dust.', price: '6.80', tag: 'Popular', photo: 'f68491603' },
    ],
  },
  {
    key: 'noodles',
    label: 'Noodles',
    items: [
      { name: 'Shoyu ramen', desc: 'Chashu pork, soft egg, nori and spring onion in an 18-hour broth.', price: '16.50', tag: 'Signature', photo: 'f141427772' },
      { name: 'Tsukemen', desc: 'Thick cold noodles to dip in a rich, reduced pork and fish broth.', price: '17.25', photo: 'f56500845' },
      { name: 'Miso ramen', desc: 'Red miso, sweetcorn, butter and bean sprouts. Ask for it spicy.', price: '16.90', photo: 'f80943699' },
    ],
  },
  {
    key: 'pasta',
    label: 'Pasta',
    items: [
      { name: 'Pesto rigatoni', desc: 'Basil and broccoli pesto, toasted pine nuts, pecorino.', price: '16.30', tag: 'Veg', photo: 'f127967731' },
      { name: 'Fusilli with tofu', desc: 'Crispy tofu, roast cherry tomato, chilli and lemon.', price: '15.40', tag: 'Vegan', photo: 'f79977114' },
      { name: 'Baked lasagna', desc: 'Slow beef ragù, béchamel and a crisp cheese top, in its own dish.', price: '18.60', photo: 'f80955894' },
    ],
  },
]

export const DAY = [
  { time: '7:30', title: 'Doors open', text: 'The first croissants come out of the oven and the espresso machine warms up.', photo: 'f170663639' },
  { time: '9:00', title: 'Chai on the stove', text: 'A big pot of masala chai, simmered with fresh ginger and cardamom.', photo: 'f12700779' },
  { time: '11:30', title: 'The kitchen opens', text: 'Broth has been going since yesterday. Noodles go in, bowls go out.', photo: 'f141427772' },
  { time: '15:00', title: 'Something sweet', text: 'Tiramisu, cardamom buns and a flat white for the afternoon slump.', photo: 'f68491603' },
  { time: '19:00', title: 'Pasta night', text: 'Lights down, rigatoni and lasagna on every table, last seating at 21:00.', photo: 'f127967731' },
]

export const HOURS = [
  { days: 'Mon – Fri', time: '7:30 – 22:00' },
  { days: 'Sat – Sun', time: '8:30 – 22:00' },
]

// Floor plan. Two layouts: wide (desktop) and tall (phone), same tables.
// x, y are the table centre; w, h its size; round = round table.
export const TABLES = [
  { id: 1, seats: 2, zone: 'Window', round: true, wide: { x: 120, y: 110 }, tall: { x: 80, y: 120 } },
  { id: 2, seats: 2, zone: 'Window', round: true, wide: { x: 250, y: 110 }, tall: { x: 200, y: 120 } },
  { id: 3, seats: 2, zone: 'Window', round: true, wide: { x: 380, y: 110 }, tall: { x: 320, y: 120 } },
  { id: 4, seats: 4, zone: 'Middle', wide: { x: 150, y: 260 }, tall: { x: 110, y: 270 } },
  { id: 5, seats: 4, zone: 'Middle', wide: { x: 340, y: 260 }, tall: { x: 290, y: 270 } },
  { id: 6, seats: 4, zone: 'Middle', wide: { x: 530, y: 260 }, tall: { x: 110, y: 410 } },
  { id: 7, seats: 6, zone: 'Long table', wide: { x: 300, y: 420 }, tall: { x: 290, y: 410 } },
  { id: 8, seats: 2, zone: 'Window', round: true, wide: { x: 510, y: 110 }, tall: { x: 130, y: 545 } },
  { id: 9, seats: 5, zone: 'Booth', wide: { x: 560, y: 430 }, tall: { x: 290, y: 545 } },
]

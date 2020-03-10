const seedData = require('./seed-data.json')
const faker = require('faker')
const {
  repeat,
  fakeOrders,
  fakeOrderItems,
  fakeUser,
  fakePrice
} = require('./seed-faker')

const db = require('../server/db')
const {User, Product, OrderItem} = require('../server/db/models')

const filteredSeedData = seedData.filter(plant => plant.images.length >= 1)

//categories: Seeds, flowers, succulents, other
// foliage_texture: ['Coarse', 'Medium', 'Fine', 'null']

function categorizePlant(plant) {
  const succulentFamily = ['Century-plant family', 'Ocotillo family']
  if (succulentFamily.includes(plant.family_common_name)) {
    return 'Succulents'
  } else if (plant.specifications_mature_height.ft > 6) {
    return 'Exterior Plants'
  } else if (plant.flower_conspicuous === true) {
    return 'Flowers'
  } else {
    return 'Other'
  }
}

function generateProductData() {
  return filteredSeedData.map(plant => {
    const name = plant.common_name ? plant.common_name : plant.scientific_name
    return {
      name: name,
      description: `The ${name} comes from the ${plant.family_common_name} family. It need a ${plant.growth_moisture_use} level of water.`,
      image: plant.images[0].url,
      price: fakePrice(),
      category: categorizePlant(plant)
    }
  })
}

async function seed(quiet = false) {
  const log = quiet ? () => {} : console.log.bind(console)
  await db.sync({force: true})
  log('db synced!')

  const userData = repeat(100, fakeUser)
  const users = await Promise.all(userData.map(d => User.create(d)))
  log(`seeded ${users.length} users`)

  const productData = generateProductData()
  const products = await Promise.all(productData.map(p => Product.create(p)))
  log(`seeded ${products.length} products`)

  const orders = await fakeOrders(users, products)
  log(`seeded ${orders.length} orders`)

  const itemsData = orders.map(order => fakeOrderItems(order, products))
  const items = await OrderItem.bulkCreate(itemsData.flat())
  log(`seeded ${items.length} order items`)

  log(`seeded successfully`)
}

async function runSeed() {
  faker.seed(999)
  console.log('seeding...')
  try {
    await seed()
  } catch (err) {
    console.error(err)
    process.exitCode = 1
  } finally {
    console.log('closing db connection')
    await db.close()
    console.log('db connection closed')
  }
}

runSeed()

const redisPubSubService = require('../services/redisPubSub.service');

class IventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe('purchase_events', (channel, message) => {
      IventoryServiceTest.updateInventory(message)
    })
  }

  static updateInventory(productId, quantity) {
    console.log(`Updated inventory ${productId} with quantity ${quantity}`)
  }
}

module.exports = new IventoryServiceTest();
const CartPage = {
  props: ['cartItems', 'totalPrice', 'name', 'phone', 'nameValid', 'phoneValid', 'canCheckout', 'orderMessage'],
  emits: ['remove', 'update-name', 'update-phone', 'checkout', 'back'],

  methods: {
    theme(lesson) {
      return "theme-" + (lesson.id % 6);
    }
  },

  template: `
    <div class="cart-wrap">
      <h2><i class="fa-solid fa-cart-shopping"></i> Your Cart</h2>

      <p class="center" v-if="cartItems.length === 0 && !orderMessage">Your cart is empty.</p>

      <!-- Cart items -->
      <div class="cart-row" v-for="item in cartItems" :key="item.lesson.id">
        <div class="cart-icon" :class="theme(item.lesson)"><i :class="item.lesson.icon"></i></div>
        <div class="cart-info">
          <strong>{{ item.lesson.topic }}</strong>
          <div>{{ item.lesson.location }} | £{{ item.lesson.price }} x {{ item.quantity }} = £{{ item.lesson.price * item.quantity }}</div>
        </div>
        <button class="remove-btn" @click="$emit('remove', item.lesson.id)">
          <i class="fa-solid fa-trash"></i> Remove
        </button>
      </div>

      <p class="total" v-if="cartItems.length > 0">Total: £{{ totalPrice }}</p>

      <!-- Checkout (part of the cart page) -->
      <div class="checkout-card" v-if="cartItems.length > 0">
        <h3>Checkout</h3>

        <div class="field">
          <label>Name (letters only)</label>
          <input type="text" :value="name" placeholder="e.g. Mark Jones"
                 @input="$emit('update-name', $event.target.value)">
          <p class="error" v-if="name !== '' && !nameValid">Name must contain letters only.</p>
        </div>

        <div class="field">
          <label>Phone (numbers only)</label>
          <input type="text" :value="phone" placeholder="e.g. 07123456789"
                 @input="$emit('update-phone', $event.target.value)">
          <p class="error" v-if="phone !== '' && !phoneValid">Phone must contain numbers only.</p>
        </div>

        <!-- Always visible, centred, enabled only when name and phone are valid -->
        <button class="checkout-btn" @click="$emit('checkout')" :disabled="!canCheckout">
          <i class="fa-solid fa-lock"></i> Checkout
        </button>
      </div>

      <p class="success" v-if="orderMessage">
        <i class="fa-solid fa-circle-check"></i> {{ orderMessage }}
      </p>

      <div class="center" v-if="cartItems.length === 0">
        <button class="back-btn" @click="$emit('back')">
          <i class="fa-solid fa-arrow-left"></i> Back to Classes
        </button>
      </div>
    </div>
  `
};

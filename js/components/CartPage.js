const CartPage = {
  props: {
    cartItems:    Array,
    totalPrice:   Number,
    name:         String,
    phone:        String,
    nameValid:    Boolean,
    phoneValid:   Boolean,
    canCheckout:  Boolean,
    orderMessage: String
  },
  emits: [
    'update-name',
    'update-phone',
    'remove-from-cart',
    'checkout',
    'back-to-lessons'
  ],
  template: `
    <section id="cart-page">

      <!-- ── Page header ── -->
      <div class="page-header">
        <h2 class="page-title">
          <i class="fa-solid fa-cart-shopping"></i> Your Cart
        </h2>
        <button class="btn btn-outline" @click="$emit('back-to-lessons')">
          <i class="fa-solid fa-arrow-left"></i> Back to Lessons
        </button>
      </div>

      <!-- ── Empty cart ── -->
      <p class="empty-msg" v-if="cartItems.length === 0 && !orderMessage">
        <i class="fa-solid fa-cart-shopping"></i> Your cart is empty.
      </p>

      <!-- ── Cart items ── -->
      <div class="cart-list" v-if="cartItems.length > 0">

        <div class="cart-row" v-for="item in cartItems" :key="item.lesson.id">
          <div class="cart-item-info">
            <div class="cart-item-icon">
              <i :class="item.lesson.icon"></i>
            </div>
            <div class="cart-item-details">
              <strong>{{ item.lesson.topic }}</strong>
              <span class="cart-item-meta">{{ item.lesson.location }}</span>
            </div>
          </div>

          <div class="cart-item-price">
            £{{ item.lesson.price }} &times; {{ item.quantity }}
            &nbsp;=&nbsp;
            <strong>£{{ item.lesson.price * item.quantity }}</strong>
          </div>

          <button class="btn btn-danger btn-sm" @click="$emit('remove-from-cart', item.lesson.id)">
            <i class="fa-solid fa-trash"></i> Remove
          </button>
        </div>

        <!-- ── Total row ── -->
        <div class="cart-total">
          <span>Total</span>
          <strong class="total-price">£{{ totalPrice }}</strong>
        </div>
      </div>

      <!-- ── Checkout form ── -->
      <div class="checkout-card" v-if="cartItems.length > 0">
        <h3 class="checkout-title">
          <i class="fa-solid fa-credit-card"></i> Checkout
        </h3>

        <div class="form-group">
          <label class="form-label">
            Full Name <span class="form-hint">(letters only)</span>
          </label>
          <input
            type="text"
            class="form-input"
            :class="{ 'input-error': name !== '' && !nameValid }"
            :value="name"
            @input="$emit('update-name', $event.target.value)"
            placeholder="e.g. Mark Jones"
          >
          <p class="field-error" v-if="name !== '' && !nameValid">
            <i class="fa-solid fa-circle-exclamation"></i>
            Name must contain letters only.
          </p>
        </div>

        <div class="form-group">
          <label class="form-label">
            Phone Number <span class="form-hint">(numbers only)</span>
          </label>
          <input
            type="text"
            class="form-input"
            :class="{ 'input-error': phone !== '' && !phoneValid }"
            :value="phone"
            @input="$emit('update-phone', $event.target.value)"
            placeholder="e.g. 07123456789"
          >
          <p class="field-error" v-if="phone !== '' && !phoneValid">
            <i class="fa-solid fa-circle-exclamation"></i>
            Phone must contain numbers only.
          </p>
        </div>

        <button
          class="btn btn-success btn-lg"
          @click="$emit('checkout')"
          :disabled="!canCheckout"
        >
          <i class="fa-solid fa-check"></i> Place Order
        </button>
      </div>

      <!-- ── Order success ── -->
      <div class="order-success" v-if="orderMessage">
        <i class="fa-solid fa-circle-check"></i>
        <p>{{ orderMessage }}</p>
      </div>

    </section>
  `
};

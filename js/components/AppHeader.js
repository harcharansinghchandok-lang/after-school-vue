const AppHeader = {
  props: {
    sitename: String,
    cartCount: { type: Number, default: 0 }
  },
  emits: ['toggle-cart'],
  template: `
    <header class="site-header">
      <div class="header-brand">
        <i class="fa-solid fa-graduation-cap"></i>
        <span>{{ sitename }}</span>
      </div>
      <button class="cart-btn" @click="$emit('toggle-cart')" :disabled="cartCount === 0">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Cart</span>
        <span class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
      </button>
    </header>
  `
};

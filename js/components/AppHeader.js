const AppHeader = {
  props: ['cartCount', 'showCart'],
  emits: ['toggle-cart', 'navigate'],

  methods: {
    // go back to the lessons page, then scroll to the chosen section
    go(sectionId) {
      this.$emit('navigate');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    }
  },

  template: `
    <header class="site-header">
      <div class="logo" @click="go('home')">
        <i class="fa-solid fa-graduation-cap"></i>After School <span>Classes</span>
      </div>

      <nav class="nav">
        <a @click="go('home')"><i class="fa-solid fa-house"></i> Home</a>
        <a @click="go('classes')"><i class="fa-solid fa-table-cells-large"></i> Classes</a>
        <a @click="go('about')"><i class="fa-solid fa-circle-info"></i> About</a>
        <a @click="go('contact')"><i class="fa-solid fa-phone"></i> Contact</a>
      </nav>

      <button class="cart-btn" @click="$emit('toggle-cart')" :disabled="cartCount === 0">
        <i class="fa-solid fa-cart-shopping"></i>Cart ({{ cartCount }})
      </button>
    </header>
  `
};
